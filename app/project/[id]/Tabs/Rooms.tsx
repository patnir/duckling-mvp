'use client'

import ModelStore from '@/app/stores/modelStore'
import ChipManager from '@/components/ChipManager'
import { Project, ProjectRoom } from '@/types/types'
import {
  Chip,
  FormControl,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material'
import { useEffect, useState } from 'react'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import PhotoCaptureModal from '@/components/Modals/PhotoModal'
import { v4 as uuidv4 } from 'uuid'

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

//TODO: check these values
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
  const [currentRoom, setCurrentRoom] = useState<ProjectRoom>({
    id: '',
    name: '',
    type: '',
    width: 0,
    length: 0,
    ceilingHeight: 0,
    floor: '',
    usage: '',
    comfortIssueTags: [],
    safetyIssueTags: [],
    notes: '',
  })

  useEffect(() => {
    if (currentProject && currentProject.rooms) {
      setRooms(currentProject.rooms)
      setCurrentRoom(currentProject.rooms[0])
    }
  }, [currentProject])

  async function deleteRoom(roomId: string) {
    await ModelStore.deleteRoom(currentProject.id!, roomId)
    const newRooms = rooms.filter((r) => r.id !== roomId)
    setRooms(newRooms)
    setCurrentRoom(newRooms[0] || {})
  }

  async function createRoom() {
    const response = await ModelStore.createRoom(currentProject.id!, {
      name: 'New Room',
      projectId: currentProject.id,
      type: '',
      width: 0,
      length: 0,
      ceilingHeight: 0,
      floor: '',
      usage: '',
      comfortIssueTags: [],
      safetyIssueTags: [],
      notes: '',
    })
    const newRoomList = [...rooms, response]

    setRooms(newRoomList)
    setCurrentRoom(response)
  }

  async function patchRoom(updatedRoom = currentRoom) {
    console.log(rooms)
    const response = await ModelStore.updateRoom(
      currentProject.id!,
      updatedRoom
    )
    const updatedRooms = rooms.map((room) => {
      if (room.id === updatedRoom.id) {
        return { ...room, ...updatedRoom }
      }
      return room
    })
    setRooms(updatedRooms)
    setCurrentRoom(response)
  }

  const handleChipChange = (inputName: string, value: string) => {
    let array = currentRoom ? (currentRoom[inputName] as string[]) : []

    if (array && array.includes(value)) {
      array = array.filter((item) => item !== value)
    } else {
      array.push(value)
    }

    const updatedRoom = { ...currentRoom, [inputName]: array }

    setCurrentRoom(updatedRoom)
    patchRoom(updatedRoom)
  }

  const handleInputChange = async (
    inputName: string,
    value: string | number
  ) => {
    if (currentRoom && currentRoom.id) {
      const updatedRoom = { ...currentRoom, [inputName]: value }
      setCurrentRoom(updatedRoom)
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
      {currentProject && (
        <PhotoCaptureModal
          open={openCamera}
          project={currentProject}
          onClose={() => setOpenCamera(false)}
          photo={{ id: uuidv4() }}
        />
      )}
      <ChipManager
        chips={rooms}
        onDelete={deleteRoom}
        onCreate={createRoom}
        currentChip={currentRoom?.id || ''}
        chipType="Room"
        onChipClick={(i: number) => setCurrentRoom(rooms[i])}
      />
      <div
        style={{
          width: '100%',
        }}
      >
        {currentRoom?.id ? (
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
              <TextField
                id="outlined-basic"
                label="Room Name"
                value={currentRoom?.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => patchRoom()}
                variant="outlined"
                placeholder="Name"
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="room-type-label">Room Type</InputLabel>
                <Select
                  placeholder="Room Type"
                  labelId="room-type-label"
                  id="room-type-select"
                  label="Room Type"
                  value={currentRoom?.type}
                  onBlur={() => patchRoom()}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {ROOM_TYPES.map((roomType, i) => (
                    <MenuItem key={i} value={roomType}>
                      {roomType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="outlined-basic"
                label="Width"
                variant="outlined"
                value={currentRoom?.width}
                onChange={(e) =>
                  handleInputChange('width', parseInt(e.target.value))
                }
                onBlur={() => patchRoom()}
                placeholder="Width"
                fullWidth
                type="number"
              />
              <TextField
                id="outlined-basic"
                label="Length"
                variant="outlined"
                value={currentRoom?.length}
                onChange={(e) =>
                  handleInputChange('length', parseInt(e.target.value))
                }
                onBlur={() => patchRoom()}
                placeholder="Length"
                fullWidth
                type="number"
              />
              <TextField
                id="outlined-basic"
                label="Ceiling Height"
                variant="outlined"
                onChange={(e) =>
                  handleInputChange('ceilingHeight', parseInt(e.target.value))
                }
                onBlur={() => patchRoom()}
                value={currentRoom?.ceilingHeight}
                placeholder="Ceiling Height"
                fullWidth
                type="number"
              />
              <FormControl fullWidth>
                <InputLabel id="width-label">Floor</InputLabel>
                <Select
                  labelId="width-label"
                  id="width-select"
                  label="Floor"
                  value={currentRoom?.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  onBlur={() => patchRoom()}
                >
                  {ROOM_FLOORS.map((floor, i) => (
                    <MenuItem key={i} value={floor}>
                      {floor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel component="legend">Usage</FormLabel>
                <ToggleButtonGroup
                  value={currentRoom?.usage}
                  exclusive
                  color="primary"
                  onChange={(e, value) => handleInputChange('usage', value)}
                  onBlur={() => patchRoom()}
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
                        currentRoom?.comfortIssueTags?.includes(issue)
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
                        currentRoom?.safetyIssueTags?.includes(issue)
                          ? 'primary'
                          : 'default'
                      }
                    />
                  ))}
                </div>
              </FormGroup>
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
