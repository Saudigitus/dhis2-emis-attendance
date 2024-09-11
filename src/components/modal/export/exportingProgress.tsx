import Lottie from "lottie-react";
import search from '../../../assets/animations/search.json'
import styles from '../modal.module.css'
import loading from '../../../assets/animations/loading.json'
import LinearBuffer from "../../progress/linearProgress";
import calendar3 from '../../../assets/animations/calendar3.json'
import { ProgressState } from "../../../schema/linearProgress";
import { useRecoilValue } from "recoil";
import useGetSectionTypeLabel from "../../../hooks/commons/useGetSectionTypeLabel";

export default function ExportProgress() {
    const progress = useRecoilValue(ProgressState)
    const { sectionName } = useGetSectionTypeLabel()

    const style = {
        height: 450,
    };

    return (
        <div className={styles.loadingContainer}>
            <h1>Exporting progress</h1>
            <div className={styles.linearProgress}>
                <LinearBuffer />
                <span className={styles.percentagem} >{Math.round(progress.progress)}%</span>
            </div>
            <div className={styles.studentSeek}>
                <Lottie style={style} className={progress.phase === 'attendance' ? styles.visble : styles.overlay} animationData={calendar3} loop={true} />
                <Lottie style={style} className={progress.phase !== 'attendance' ? styles.visible : styles.overlay} animationData={search} loop={true} />
            </div>
            <div className={styles.loading} >
                <span>Loading {sectionName} {progress.phase === 'attendance' ? 'attendances' : 'enrollment details'}</span>
                <Lottie style={{ height: 100, marginLeft: "-40px" }} animationData={loading} loop={true} />
            </div>
        </div>
    )
}