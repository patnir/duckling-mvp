'use client'

import ChipManager from '@/components/ChipManager'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import InsulationForm from './EnvelopesForms/InsulationForm';
import AirSealingForm from './EnvelopesForms/AirSealingForm';
import { Project, ProjectEnvelope } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

interface EnvelopeProps {
  currentProject: Project;
}

const Envelope: React.FC<EnvelopeProps> = ({ currentProject }) => {
  const [envelopes, setEnvelopes] = useState<ProjectEnvelope[]>([])
  const [currentEnvelope, setCurrentEnvelope] = useState<ProjectEnvelope>({
    id: '',
    type: '',
    name: '',
    location: '',
    leakinessDescription: '',
    insulationLocation: '',
    insulationCondition: '',
    notes: '',
    condition: '',
  })

  useEffect(() => {
    if (currentProject && currentProject.envelopes) {
      setEnvelopes(currentProject.envelopes)
      setCurrentEnvelope(currentProject.envelopes[0])
    }
  }, [currentProject])

  const handleTypeChange = (value: string) => {
    const updatedEnvelope = {...currentEnvelope, type: value}
    handlePostEnvelope(updatedEnvelope, value)
  }

  function createEnvelope() {
    const newEnvelope = {
      id: uuidv4(),
      name: 'New Envelope',
      type: '',
      location: '',
      leakinessDescription: '',
      insulationLocation: '',
      insulationCondition: '',
      notes: '',
      condition: '',
    };

    const newEnvelopeList = [...envelopes, newEnvelope];
    setEnvelopes(newEnvelopeList);
    setCurrentEnvelope(newEnvelope);
  }

  async function handlePostEnvelope(updatedEnvelope: ProjectEnvelope, type: string) {
    try {
      const oldId = updatedEnvelope.id;
      delete updatedEnvelope.id;
      const data = await fetch(`/api/project${type}`, {
        method: 'POST',
        body: JSON.stringify({
            ...updatedEnvelope,
            projectId: currentProject.id
          })
      });

      if (data.ok) {
        const response = await data.json()
        const createdEnvelope = {...response, type: updatedEnvelope.type}

        const updatedEnvelopes = envelopes.map((envelope) => {
          if (envelope.id === oldId) {
            return { ...envelope, ...createdEnvelope };
          }
          return envelope;
        });

        setEnvelopes(updatedEnvelopes);
        setCurrentEnvelope(createdEnvelope);
      } else {
        throw new Error('Failed to create a new envelope.');
      }
    } catch (error) {
      console.error('Error creating a new envelope:', error);
      throw error;
    }
  }

  async function deleteEnvelope(envelopeId: string) {
    const envelopeToDelete = envelopes.find(envelope => envelope.id === envelopeId);

    if (!envelopeToDelete) {
      return;
    }

    if (!envelopeToDelete.type) {
      const newEnvelopeList = envelopes.filter(r => r.id !== envelopeId);
      setEnvelopes(newEnvelopeList);
      setCurrentEnvelope(newEnvelopeList[0] || {});
      return;
    }

    try {
      const response = await fetch(`/api/project${envelopeToDelete.type}/${envelopeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Old envelope deleted successfully.');
        const newEnvelopeList = envelopes.filter(r => r.id !== envelopeId);
        setEnvelopes(newEnvelopeList);
        setCurrentEnvelope(newEnvelopeList[0] || {});
      } else {
        throw new Error('Failed to delete the old envelope.');
      }
    } catch (error) {
      console.error('Error deleting the old envelope:', error);
      throw error;
    }
  }

  function handleInputChange(inputName: string, value: string) {
    if (currentEnvelope && currentEnvelope.id) {
      const updatedEnvelope = { ...currentEnvelope, [inputName]: value };
      setCurrentEnvelope(updatedEnvelope);
    }
  }

  async function patchEnvelope(updatedEnvelope = currentEnvelope) {
    console.log('caiu aqui')
    if (updatedEnvelope && updatedEnvelope.id) {
      try {
        const data = await fetch(`/api/project${updatedEnvelope.type}/${updatedEnvelope.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            ...updatedEnvelope,
            projectId: currentProject.id
          })
        });

        if (data.ok) {
          const response = await data.json();
          response.type = updatedEnvelope.type;

          const updatedEnvelopes = envelopes.map((envelope) => {
            if (envelope.id === updatedEnvelope.id) {
              return { ...envelope, ...updatedEnvelope };
            }
            return envelope;
          });

          setEnvelopes(updatedEnvelopes);
          setCurrentEnvelope(response);
          console.log(response);
        } else {
          throw new Error('Failed to update the envelope.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const renderForm = () => {
    switch(currentEnvelope?.type) {
      case 'Insulation':
        return (<InsulationForm onUpdate={() => patchEnvelope()} onChange={handleInputChange} currentEnvelope={currentEnvelope}/>);
      case 'AirSealing':
        return (<AirSealingForm onUpdate={() => patchEnvelope()} onChange={handleInputChange} currentEnvelope={currentEnvelope}/>);
      default:
          return (null);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        padding: '32px',
        gap: '32px',
      }}
    >
      <ChipManager
        onCreate={createEnvelope}
        onDelete={deleteEnvelope}
        chips={envelopes}
        currentChip={currentEnvelope?.id || ''}
        chipType="Envelope"
        onChipClick={(i: number) => {
          console.log(envelopes)
          setCurrentEnvelope(envelopes[i])
        }}
      />
      <div
        style={{
          width: '100%',
        }}
      >
        {currentEnvelope && <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="envelope-type-label">Type</InputLabel>
            <Select
              labelId="envelope-type-label"
              id="envelope-type-select"
              label="Type"
              value={currentEnvelope?.type}
              disabled={currentEnvelope?.type ? true : false}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <MenuItem value={''} disabled={true}>Select Type</MenuItem>
              <MenuItem value={'Insulation'}>Insulation</MenuItem>
              <MenuItem value={'AirSealing'}>Air Sealing</MenuItem>
            </Select>
          </FormControl>
          {renderForm()}
        </form>}
      </div>
    </div>
  )
}

export default Envelope
