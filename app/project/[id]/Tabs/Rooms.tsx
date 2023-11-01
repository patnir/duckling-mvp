'use client'

import ModelStore from '@/app/stores/modelStore'
import ChipManager from '@/components/ChipManager'
import { SelectInput, TextInput } from '@/components/Inputs'
import PhotoCaptureModal from '@/components/Modals/PhotoModal'
import PhotoDisplay from '@/components/PhotoDisplay'
import { Project, ProjectRoom } from '@/types/types'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import {
  Button,
  Chip,
  FormControl,
  FormGroup,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { useEffect, useState } from 'react'

const COMFORT_ISSUES = [
  'Drafty',
  'Too hot in summer',
  'Too cold in summer',
  'Too hot in winter',
  'Too cold in winter',
  'Humid',
  'Dry',
  'Noisy System',
]

const HEALTH_SAFETY = ['Mold', 'Allergens', 'Indoor air quality', 'Asbestos']

const ROOM_TYPES = [
  'Bedroom',
  'Living Room',
  'Dining Room',
  'Family Room',
  'Kitchen',
  'Office',
  'Bathroom',
  'Basement',
  'Other',
]

const ROOM_FLOORS = [
  'Basement',
  'Ground Floor',
  'Second Floor',
  'Third Floor',
  'Attic',
  'Other',
]

interface RoomsProps {
  currentProject: Project
}

const Rooms: React.FC<RoomsProps> = ({ currentProject }) => {
  const [rooms, setRooms] = useState<ProjectRoom[]>([])
  const [openCamera, setOpenCamera] = useState<boolean>(false)
  const [currentRoom, setCurrentRoom] = useState<number | null>(null)

  useEffect(() => {
    if (currentProject && currentProject.rooms) {
      setRooms(currentProject.rooms)
      setCurrentRoom(currentProject.rooms.length > 0 ? 0 : null)
    }
  }, [currentProject, currentRoom, rooms])

  async function deleteRoom(roomId: string) {
    await ModelStore.deleteRoom(currentProject.id!, roomId)
    const newRooms = rooms.filter((r) => r.id !== roomId)
    setRooms(newRooms)
    setCurrentRoom(newRooms.length > 0 ? 0 : null)
  }

  async function createRoom() {
    const createdRoom = await ModelStore.createRoom(currentProject.id!, {
      name: 'New Room',
      projectId: currentProject.id,
    })
    const newRoomList = [...rooms, createdRoom]
    console.log(createdRoom)
    setRooms(newRoomList)
    console.log(newRoomList.length - 1)
    setCurrentRoom(newRoomList.length - 1)
  }

  async function patchRoom(propName: string) {
    if (currentRoom) {
      const tempRoom = rooms[currentRoom]
      const roomToUpdate: ProjectRoom = { id: tempRoom.id }
      roomToUpdate[propName] = tempRoom[propName]

      const updatedRooms = [...rooms]
      updatedRooms[currentRoom] = roomToUpdate

      await ModelStore.updateRoom(currentProject.id!, roomToUpdate)

      setRooms(updatedRooms)
    }
  }

  const toggleTagValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value]
  }

  const handleChipChange = (inputName: string, value: string) => {
    if (currentRoom) {
      const tempRooms = [...rooms]

      tempRooms[currentRoom][inputName] = toggleTagValue(
        (tempRooms[currentRoom][inputName] as string[]) || [],
        value
      )

      patchRoom(inputName)
    }
  }

  const handleInputChange = async (
    inputName: string,
    value: string | number
  ) => {
    console.log('inputName, value')
    console.log(inputName, value)
    console.log(currentRoom)
    console.log(rooms)
    if (currentRoom) {
      const newRooms = [...rooms]
      newRooms[currentRoom][inputName] = value
      setRooms(newRooms)
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
        chips={rooms}
        onDelete={deleteRoom}
        onCreate={createRoom}
        currentChip={currentRoom !== null ? rooms[currentRoom]?.id || '' : ''}
        chipType="Room"
        onChipClick={(i: number) => setCurrentRoom(i)}
      />
      {currentRoom && (
        <PhotoCaptureModal
          open={openCamera}
          project={currentProject}
          onClose={() => setOpenCamera(false)}
          photo={{ roomId: rooms[currentRoom]?.id }}
        />
      )}
      <div
        style={{
          width: '100%',
        }}
      >
        {currentRoom !== null ? (
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <TextInput
                label="Room Name"
                placeholder="Room Name"
                value={rooms[currentRoom]?.name || ''}
                onChange={(value) => handleInputChange('name', value)}
                onBlur={() => patchRoom('name')}
              />
              <SelectInput
                label="Room Type"
                value={rooms[currentRoom]?.type || ''}
                onChange={(value) => handleInputChange('type', value)}
                onBlur={() => patchRoom('type')}
                options={ROOM_TYPES}
              />
              <TextInput
                label="Width"
                placeholder="Width"
                type="tel"
                value={rooms[currentRoom]?.width || ''}
                onChange={(value) =>
                  handleInputChange('width', parseInt(value))
                }
                onBlur={() => patchRoom('width')}
                endAdornment="ft"
              />
              <TextInput
                label="Length"
                placeholder="Length"
                type="tel"
                value={rooms[currentRoom]?.length || ''}
                onChange={(value) =>
                  handleInputChange('length', parseInt(value))
                }
                onBlur={() => patchRoom('length')}
                endAdornment="ft"
              />
              <TextInput
                label="Ceiling Height"
                placeholder="Ceiling Height"
                type="tel"
                value={rooms[currentRoom]?.ceilingHeight || ''}
                onChange={(value) =>
                  handleInputChange('ceilingHeight', parseInt(value))
                }
                onBlur={() => patchRoom('ceilingHeight')}
                endAdornment="ft"
              />
              <SelectInput
                label="Floor"
                value={rooms[currentRoom]?.floor || ''}
                onChange={(value) => handleInputChange('floor', value)}
                onBlur={() => patchRoom('floor')}
                options={ROOM_FLOORS}
              />
              <FormControl>
                <FormLabel component="legend">Usage</FormLabel>
                <ToggleButtonGroup
                  value={rooms[currentRoom]?.usage}
                  exclusive
                  color="primary"
                  onChange={(e, value) => handleInputChange('usage', value)}
                  onBlur={() => patchRoom('usage')}
                  aria-label="usage"
                >
                  <ToggleButton value="rare" aria-label="left aligned">
                    Rare
                  </ToggleButton>
                  <ToggleButton value="regular" aria-label="centered">
                    Regular
                  </ToggleButton>
                  <ToggleButton value="frequent" aria-label="right aligned">
                    Frequent
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
              <FormGroup>
                <FormLabel>Comfort Issues</FormLabel>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginTop: '12px',
                    marginBottom: '24px',
                  }}
                >
                  {COMFORT_ISSUES.map((issue, i) => (
                    <Chip
                      onClick={() =>
                        handleChipChange('comfortIssueTags', issue)
                      }
                      label={issue}
                      key={i}
                      color={
                        rooms[currentRoom]?.comfortIssueTags?.includes(issue)
                          ? 'primary'
                          : 'default'
                      }
                    />
                  ))}
                </div>
              </FormGroup>
              <FormGroup>
                <FormLabel>Health & Safety Issues</FormLabel>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginTop: '12px',
                    marginBottom: '24px',
                  }}
                >
                  {HEALTH_SAFETY.map((issue, i) => (
                    <Chip
                      onClick={() => handleChipChange('safetyIssueTags', issue)}
                      label={issue}
                      key={i}
                      color={
                        rooms[currentRoom]?.safetyIssueTags?.includes(issue)
                          ? 'primary'
                          : 'default'
                      }
                    />
                  ))}
                </div>
              </FormGroup>
              <TextInput
                label="Notes"
                placeholder="Notes"
                onChange={(value) => handleInputChange('notes', value)}
                onBlur={() => patchRoom('notes')}
                value={rooms[currentRoom].notes || ''}
                multiline={true}
              />
              <PhotoDisplay
                currentProject={currentProject}
                filterCriteria={{ roomId: rooms[currentRoom].id! }}
              ></PhotoDisplay>
              <Button
                variant="contained"
                startIcon={<CameraAltOutlinedIcon />}
                onClick={() => setOpenCamera(true)}
              >
                Add Photo
              </Button>
            </div>
          </form>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default Rooms
