'use client'

import { useEffect, useState } from 'react';
import ChipManager from '@/components/ChipManager'
import InsulationForm from './EnvelopesForms/InsulationForm';
import AirSealingForm from './EnvelopesForms/AirSealingForm';
import { Project, ProjectEnvelope } from '@/types/types';
import ModelStore from '@/app/stores/modelStore';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { SelectInput } from '@/components/Inputs';
import { v4 } from 'uuid';
import PhotoDisplay from '@/components/PhotoDisplay';
import AddPhotoButton from '@/components/AddPhotoButton';

interface EnvelopeProps {
  currentProject: Project
}

const Envelope: React.FC<EnvelopeProps> = observer(({ currentProject }) => {
  const [envelopes, setEnvelopes] = useState<ProjectEnvelope[]>([])
  const [currentEnvelope, setCurrentEnvelope] = useState<ProjectEnvelope>({})

  useEffect(() => {
    if (currentProject?.envelopes) {
      setEnvelopes(currentProject.envelopes)

      if (!currentEnvelope) {
        setCurrentEnvelope(currentProject.envelopes[0])
      }
    }
  }, [currentProject, currentProject.envelopes])

  function handleTypeChange(value: string) {
    const updatedEnvelope = { ...currentEnvelope, type: value }
    handlePostEnvelope(updatedEnvelope, value)
  }

  function createEnvelope() {
    const newEnvelope = {
      id: v4(),
      name: 'New Envelope',
    }

    const newEnvelopeList = [...envelopes, newEnvelope]
    setEnvelopes(newEnvelopeList)
    setCurrentEnvelope(newEnvelope)
  }

  async function handlePostEnvelope(envelope: ProjectEnvelope, type: string) {
    envelope.type = type
    const createdEnvelope = await ModelStore.createEnvelope(
      currentProject.id!,
      envelope
    )
    const updatedEnvelopes = envelopes.map((envelope) => {
      if (envelope.id === createdEnvelope.id) {
        return { ...envelope, ...createdEnvelope }
      }
      return envelope
    })
    setEnvelopes(updatedEnvelopes)
    setCurrentEnvelope(createdEnvelope)
  }

  async function deleteEnvelope(envelopeId: string) {
    const envelopeToDelete = envelopes.find(
      (envelope) => envelope.id === envelopeId
    )

    if (!envelopeToDelete) {
      return
    }

    if (!envelopeToDelete.type) {
      const newEnvelopeList = envelopes.filter((r) => r.id !== envelopeId)
      setEnvelopes(newEnvelopeList)
      setCurrentEnvelope(newEnvelopeList[0] || {})
      return
    }

    await ModelStore.deleteEnvelope(
      currentProject.id!,
      envelopeToDelete.type,
      envelopeId
    )
    const newEnvelopeList = envelopes.filter((r) => r.id !== envelopeId)
    setEnvelopes(newEnvelopeList)
    setCurrentEnvelope(newEnvelopeList[0] || {})
  }

  function handleInputChange(inputName: string, value: string) {
    if (currentEnvelope && currentEnvelope.id) {
      const updatedEnvelope = { ...currentEnvelope, [inputName]: value }
      setCurrentEnvelope(updatedEnvelope)
    }
  }

  async function patchEnvelope(
    propName: string, updatedEnvelope = currentEnvelope) {
    if (updatedEnvelope?.id) {
      const envelopeToUpdate = {
        id: updatedEnvelope.id,
        type: updatedEnvelope.type,
        [propName]: updatedEnvelope[propName]
      }

      const updatedEnvelopes = envelopes.map((envelope) => {
        if (envelope.id === updatedEnvelope.id) {
          return { ...envelope, [propName]: updatedEnvelope[propName] }
        }
        return envelope
      })

      await ModelStore.updateEnvelope(
        currentProject.id!,
        envelopeToUpdate
      )

      setEnvelopes(updatedEnvelopes)
    }
  }

  const renderForm = () => {
    switch (currentEnvelope?.type) {
      case 'Insulation':
        return (
          <InsulationForm
            onUpdate={(inputName: string) => patchEnvelope(inputName)}
            onChange={handleInputChange}
            currentEnvelope={currentEnvelope}
          />
        )
      case 'AirSealing':
        return (
          <AirSealingForm
            onUpdate={(inputName: string) => patchEnvelope(inputName)}
            onChange={handleInputChange}
            currentEnvelope={currentEnvelope}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
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
            console.log(toJS(envelopes[i]))
            setCurrentEnvelope(envelopes[i])
          }}
        />
        <div
          style={{
            width: '100%',
          }}
        >
          {currentEnvelope?.id && <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <SelectInput
              label="Type"
              value={currentEnvelope?.type || ''}
              onChange={(value) => handleTypeChange(value)}
              disabled={currentEnvelope?.type ? true : false}
              options={['Insulation', 'AirSealing']}
            />
            {renderForm()}
            <PhotoDisplay
              currentProject={currentProject}
              filterCriteria={ { envelopeId: currentEnvelope.id! } }
            ></PhotoDisplay>
            <AddPhotoButton 
              photoUpdates={{ envelopeId: currentEnvelope?.id }}
            />
          </form>}
        </div>
      </div>
    </>
  )
})

export default Envelope
