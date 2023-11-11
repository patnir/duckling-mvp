import ModelStore from "@/app/stores/modelStore";
import { observer } from "mobx-react-lite";
import { Mode, SyncOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";

const PendingStatus = observer(() => {

    const [onlineStatusFiveSecondsAgo, setOnlineStatusFiveSecondsAgo] = useState(ModelStore.onlineStatus);

    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineStatusFiveSecondsAgo(ModelStore.onlineStatus)
        }, 5000)
        return () => clearInterval(interval);
    }, []);

    return <div style= {{
        width: '100%',
        textAlign: 'center',
        fontSize: '0.75em',
        paddingTop: '1px',
        display: 'flex',
        alignItems: "center",
        justifyItems: "center",
        justifyContent: "center"
    }}>
        { ModelStore.onlineStatus === 'offline' &&
            <div>
                <div>Sync status <SyncOutlined fontSize="inherit"/> Offline.</div>
                <div>{`Changes will be synced once you're back online.`}</div>
            </div>
        }
        { ModelStore.onlineStatus === 'online' && 
            <div>
                { ModelStore.hasPendingChanges && 
                    <div> Sync status <SyncOutlined fontSize="inherit"/> Unsaved changes pending...</div>
                }
                { !ModelStore.hasPendingChanges &&
                    <div> Sync status <SyncOutlined fontSize="inherit"/> Up to date.</div>
                }
                { onlineStatusFiveSecondsAgo === 'offline' && <div> You are back online! ✅  </div> }
            </div> 
        }
    </div>
})

export default PendingStatus;