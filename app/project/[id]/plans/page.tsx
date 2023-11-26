'use client'

import { useEffect, useState } from "react"
import PlanModal from "@/components/Modals/PlanModal"
import * as Icons from "@mui/icons-material"
import { Button, Chip, Divider, IconButton, Slider, Stack } from "@mui/material"
import ModelStore from "@/app/stores/modelStore"
import { 
  HomePerformance,
  Hvac,
  ApplianceUpgrades,
  EnergyStorage,
  Photos
} from "./Upgrades"

import "./style.scss"
import { Plan } from "@/types/types"

const Plans = ({currentProject}) => {
  const [plans, setPlans] = useState([])
  const [currentPlan, setCurrentPlan] = useState({})
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [hideFinance, setHideFinance] = useState(false)

  useEffect(() => {
    if (currentProject && currentProject?.plans) {
      setPlans(currentProject.plans)
      if (!currentPlan) {
        setCurrentPlan(currentProject.plans[0])
      }
    }
  })

  async function handlePlanCreation(name: string) {
    const plan : Plan = {
      name: name
    }
    const newPlan = await ModelStore.createPlan(currentProject.id, plan)
    setCurrentPlan(newPlan)
  }

  async function handlePlanDeletion() {
    await ModelStore.deletePlan(currentProject.id, currentPlan.id)

    const newPlansList = plans.filter((plan) => plan.id !== currentPlan.id)
    setPlans(newPlansList)
    setCurrentPlan(newPlansList[0] || {})

  }

  return (
    <>
      <PlanModal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false)
          setEditMode(false)
        }}
        onConfirm={(name) => handlePlanCreation(name)}
        currentName={currentPlan.name}
        editMode={editMode}
      />
      <div className="planCreation">
        <div className="planCreation__buttons">
          {plans?.length > 0 ? (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}>
              {plans?.map((plan) => 
                <Chip
                  label={plan.name}
                  color={
                    currentPlan?.id === plan.id
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => setCurrentPlan(plan)}/>
              )}
              <IconButton
                sx={{
                  borderRadius: '4px',
                  border: '1px solid #2196F3',
                  color: '#2196F3',
                  padding: '4px 11px',
                }}
                aria-label="add"
                onClick={() => setCreateModalOpen(true)}
              >
                <Icons.Add />
              </IconButton>
            </div>
          ) :
          (<Button
            variant="contained"
            size="small"
            onClick={() => setCreateModalOpen(true)}
            startIcon={<Icons.Add />}>
              Create new plan
          </Button>)
          }
        </div>
        {currentPlan?.id && (
          <div className="planCreation__wrapper">
            <div className="planCreation__leftContainer">
              <div className="planCreation__leftHeader">
                <p className="planCreation__title">{currentPlan.name}</p>
                <IconButton
                  sx={{
                    borderRadius: '4px',
                    border: '1px solid #2196F3',
                    color: '#2196F3',
                    padding: '4px 11px',
                  }}
                  aria-label="add"
                  onClick={() => {
                    setEditMode(true)
                    setCreateModalOpen(true)
                  }}
                >
                  <Icons.Edit />
                </IconButton>
                <IconButton
                  sx={{
                    borderRadius: '4px',
                    border: '1px solid #2196F3',
                    color: '#2196F3',
                    padding: '4px 11px',
                  }}
                  aria-label="add"
                >
                  <Icons.Delete onClick={() => handlePlanDeletion()}/>
                </IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setCreateModalOpen(true)}
                  startIcon={<Icons.Check />}
                  sx={{
                    backgroundColor: "#2E7D32"
                  }}
                >
                  Complete Plan
                </Button>
              </div>
              <small>Click on “+ ADD” buttons to start adding projects.</small>
              <HomePerformance />
              <Hvac />
              <ApplianceUpgrades />
              <EnergyStorage />
              <Photos />
            </div>
            <div className="planCreation__rightContainer">
              <div className="planCreation__rightHeader">
                <IconButton sx={{
                    borderRadius: '4px',
                    border: '1px solid #2196F3',
                    color: '#2196F3',
                    padding: '4px 11px',
                  }}
                  onClick={() => setHideFinance(!hideFinance)}>
                  <Icons.DoubleArrow/>
                </IconButton>
                <p>Finance & Impact</p>
              </div>
              <div className="planCreation__cost">
                <div className="planCreation__sectionHeader">
                  <div>
                    <Icons.AttachMoney fontSize="small" />
                    <p>Cost</p>
                  </div>
                  <IconButton sx={{
                    borderRadius: '4px',
                    backgroundColor: '#2196F3',
                    color: '#fff',
                    padding: '4px 11px',
                  }}>
                    <Icons.Tune/>
                  </IconButton>
                </div>
                <div className="planCreation__sectionItem">
                  Estimated Cost
                  <span>-</span>
                </div>
                <Divider />
                <div className="planCreation__sectionItem">
                  Incentives
                  <span>-</span>
                </div>
                <Divider />
                <div className="planCreation__sectionItem">
                  Cost
                  <span>-</span>
                </div>
                <Divider />
                <div className="planCreation__financing">
                  Financing Options
                  <div className="planCreation__financingItem">
                    Loan Options:
                    Loan Amount:
                    <Stack>
                      <span>-</span><Slider/>
                    </Stack>
                  </div>
                  <Divider />
                  <div className="planCreation__financingItem">
                    Upfront Cost:
                    <span>-</span>
                    Monthly Payment:
                    <span>-</span>
                  </div>
                </div>
              </div>
              <div className="planCreation__upgradeImpact">
                <div className="planCreation__sectionHeader">
                  <div>
                    <Icons.Home fontSize="small" />
                    <p>Upgrade Impact</p>
                  </div>
                </div>
                <div className="planCreation__sectionItem">
                  Comfort:
                  <div className="planCreation__sectionStars">
                    <Icons.Star />
                    <Icons.Star />
                  </div>
                </div>
                <div className="planCreation__sectionItem">
                  Health & Safety:
                  <div className="planCreation__sectionStars">
                    <Icons.Star />
                    <Icons.Star />
                    <Icons.Star />
                  </div>
                </div>
                <div className="planCreation__sectionItem">
                  Performance
                  <div className="planCreation__sectionStars">
                    <Icons.Star />
                    <Icons.Star />
                  </div>
                </div>
                <div className="planCreation__sectionItem">
                  Emissions
                  <div className="planCreation__sectionStars">
                    <Icons.Star />
                    <Icons.Star />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>

  )
}


export default Plans