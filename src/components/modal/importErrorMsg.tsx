import Lottie from 'lottie-react'
import styles from './modal.module.css'
import error from '../../assets/animations/error.json'
import { Button, ButtonStrip, IconInfo24, IconCross24 } from '@dhis2/ui'
import InfoTable from './infoTable/infoTable'
import { useState } from 'react'

export default function ShowImportError({ setOpen, errorDetails }: { setOpen: (arg: boolean) => void, errorDetails: any }) {
    const [showInfo, setShowInfo] = useState(false)
    const props = showInfo ? { end: true } : { middle: true };

    return (
        <div style={{ maxHeight: "67vh", overflow: "hidden" }}>
            {
                !showInfo ?
                    <>
                        <Lottie style={{ height: 150 }} animationData={error} loop={true} />
                        <h1 className={styles.error} >{errorDetails.msg} {errorDetails.sheet && 'in ' + errorDetails.sheet}</h1>
                    </>

                    : <div style={{ maxHeight: "60vh", overflow: "auto" }} >
                        <InfoTable sheet={errorDetails.sheet} data={errorDetails.invalidData} />
                    </div>
            }

            <ButtonStrip {...props} className={styles.strip} >
                {(errorDetails.invalidData && !showInfo) && <Button onClick={() => setShowInfo(true)} icon={<IconInfo24 />} primary>
                    Error info
                </Button>}
                <Button icon={<IconCross24 />} onClick={() => { setOpen(false); setShowInfo(false) }}>
                    Close
                </Button>
            </ButtonStrip >
        </div>
    )
}