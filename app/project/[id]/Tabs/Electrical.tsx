"use client";

// import ChipManager from "@/components/ChipManager";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import ElectricalPanelForm from "./ElectricalForms/ElectricalPanelForm";
import SolarPanelForm from "./ElectricalForms/SolarPanelForm";
import BatteryForm from "./ElectricalForms/BatteryForm";
import EVChargerForm from "./ElectricalForms/EVChargerForm";
import GeneratorForm from "./ElectricalForms/GeneratorForm";
import ChipManager from "@/components/ChipManager";
import { ProjectElectrical } from "@/types/types";

const TYPES = [
  {name: "Electrical Panel", value: "electricalpanel"},
  {name: "Solar", value: "solar"},
  {name: "Battery", value: "battery"},
  {name: "EV Charger", value: "evcharger"},
  {name: "Generator", value: "generator"}
]

const Electrical = ({ currentProject }) => {
  const [electricals, setElectricals] = useState([])
  const [currentElectrical, setCurrentElectrical] = useState({
    id: "",
    type: '',
  });

  useEffect(() => {
    if (currentProject && currentProject?.electrical) {
      setElectricals(currentProject.electrical)
      setCurrentElectrical(currentProject.electrical[0])
    }
  }, [currentProject])

  function createElectrical() {

    const newElectrical = {
      id: '',
      name: "New Electrical",
    };

    const newElectricalsList = [...electricals, newElectrical];
    setElectricals(newElectricalsList);
    setCurrentElectrical(newElectrical);
  }

  const handleTypeChange = (name: string, value: string) => {
    const updatedElectrical = {...currentElectrical, [name]: value}
    handlePostElectrical(updatedElectrical, value)
  }

  async function handlePostElectrical(updatedElectrical: ProjectElectrical, type: string) {
    const api = type === 'electricalpanel' ? 'panel' : (type === 'evcharger' ? 'evCharger' : type);

    try {
      const data = await fetch(`/api/electrical/${api}`, {
        method: 'POST',
        body: JSON.stringify({
            ...updatedElectrical,
            projectId: currentProject.id
          })
      });

      if (data.ok) {
        console.log('New appliance created successfully.');

        const updatedElectricals = electricals.map((electrical) => {
          if (electrical.id === updatedElectrical.id) {
            return { ...electrical, ...updatedElectrical };
          }
          return electrical;
        });

        setElectricals(updatedElectricals);

        const response = await data.json()
        const createdElectrical = {...response, type: updatedElectrical.type}
        setCurrentElectrical(createdElectrical)
      } else {
        throw new Error('Failed to create a new appliance.');
      }
    } catch (error) {
      console.error('Error creating a new appliance:', error);
      throw error;
    }
  }

  async function deleteElectrical(electricalId: string) {
    const electricalToDelete = electricals.find(electrical => electrical.id === electricalId);

    if (electricalToDelete) {
      const api = electricalToDelete.type.toLowerCase() === 'electricalpanel' ? 'panel' : (electricalToDelete.type.toLowerCase() === 'evcharger' ? 'evCharger' : electricalToDelete.type.toLowerCase());

      try {
        const response = await fetch(`/api/electrical/${api}/${electricalId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Electrical deleted successfully.');
          const newElectricalsList = electricals.filter(r => r.id !== electricalId);
          setElectricals(newElectricalsList);
          setCurrentElectrical(newElectricalsList[0] || {});
        } else {
          throw new Error('Failed to delete the electrical.');
        }
      } catch (error) {
        console.error('Error deleting the electrical:', error);
        throw error;
      }
    }
  }

  async function patchElectrical(updatedElectrical) {
    const api = updatedElectrical.type.toLowerCase() === 'electricalpanel' ? 'panel' : (updatedElectrical.type.toLowerCase() === 'evcharger' ? 'evCharger' : updatedElectrical.type.toLowerCase());

    if (updatedElectrical) {
      try {
        const data = await fetch(`/api/electrical/${api}/${updatedElectrical.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            ...updatedElectrical,
            projectId: currentProject.id
          })
        });

        if (data.ok) {
          const response = await data.json();
          response.type = updatedElectrical.type;

          const updatedElectricals = electricals.map((electrical) => {
            if (electrical.id === updatedElectrical.id) {
              return { ...electrical, ...updatedElectrical };
            }
            return electrical;
          });

          setElectricals(updatedElectricals);
          setCurrentElectrical(response);
          console.log(response);
        } else {
          throw new Error('Failed to update the appliance.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleInputChange(inputName: string, value: string) {
    console.log('inputName')
    if (currentElectrical) {
      const updatedElectrical = { ...currentElectrical, [inputName]: value };
      setCurrentElectrical(updatedElectrical);
      patchElectrical(updatedElectrical);
    }
  }


  const renderForm = () => {
    switch(currentElectrical?.type?.toLowerCase()) {
      case 'electricalpanel':
        return (<ElectricalPanelForm onChange={handleInputChange} currentElectrical={currentElectrical} />);
      case 'solar':
        return (<SolarPanelForm onChange={handleInputChange} currentElectrical={currentElectrical}/>);
      case 'battery':
        return (<BatteryForm onChange={handleInputChange} currentElectrical={currentElectrical}/>);
      case 'evcharger':
        return (<EVChargerForm onChange={handleInputChange} currentElectrical={currentElectrical}/>);
      case 'generator':
        return (<GeneratorForm onChange={handleInputChange} currentElectrical={currentElectrical}/>);
      default:
        return null;
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
        onDelete={deleteElectrical}
        onCreate={createElectrical}
        chipType="Electrical"
        chips={electricals}
        currentChip={currentElectrical?.id}
        onChipClick={(i: number) => setCurrentElectrical(electricals[i])}
      />
      <div style={{
        width: '100%',
      }}>
        <form style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <FormControl fullWidth>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type-select"
              label="Type"
              value={currentElectrical?.type?.toLowerCase()}
              onChange={({ target }) => handleTypeChange('type', target.value)}
              disabled={currentElectrical?.type ? true : false}
            >
              {
                TYPES.map((type, i) => (
                  <MenuItem key={i} value={type.value}>{type.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          {renderForm()}
        </form>
      </div>
    </div>
  )
}

export default Electrical