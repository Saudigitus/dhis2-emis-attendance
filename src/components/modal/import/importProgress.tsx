import Lottie from "lottie-react";
import styles from '../modal.module.css'
import loading from '../../../assets/animations/loading.json'
import LinearBuffer from "../../progress/linearProgress";
import calendar3 from '../../../assets/animations/attendanceUpload.json'
import { ProgressState } from "../../../schema/linearProgress";
import { useRecoilValue } from "recoil";

export default function ImportProgress() {
    const progress = useRecoilValue(ProgressState)

    const style = {
        height: 450,
    };

    return (
        <div className={styles.loadingContainer}>
            <h1>Importing progress</h1>
            <div className={styles.linearProgress}>
                <LinearBuffer />
                <span className={styles.percentagem} >{Math.round(progress.progress)}%</span>
            </div>
            <div className={styles.studentSeek}>
                <Lottie style={style} className={styles.visble} animationData={calendar3} loop={true} />
            </div>
            <div className={styles.loading} >
                <span>Uploading attendance values</span>
                <Lottie style={{ height: 100, marginLeft: "-40px" }} animationData={loading} loop={true} />
            </div>
        </div>
    )
}