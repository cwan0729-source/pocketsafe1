import {useState} from "react";
import "./Estimate.css";

export default function Estimate({  close, onSubmit}){
    const [scores, setScores] = useState({
        safety:"", clean:"", crowd:"", facility:"", pet:""
    });

    const handleSelect = (field, value) =>{
        setScores((prev)=> ({
            ...prev, [field]: value
        }));
    };

    const handleSubmit = () => {
        onSubmit(scores);
        close();
    };

    return (
        <div className="E-overlay">
            <div className="E-modal">
                <button className="E-close" onClick={close}>X</button>
                <div className="box">
                    <p>안전도</p>
                    <div className="option">
                        {["높음", "보통", "낮음"].map((val)=> (
                            <button key={val} className={`op-btn ${scores.safety === val ? val : ""}`}
                            onClick={()=> handleSelect("safety", val)}>
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="box">
                    <p>청결도</p>
                    <div className="option">
                        {["좋음", "보통", "나쁨"].map((val)=> (
                            <button key={val} className={`op-btn ${scores.clean === val ? val : ""}`}
                            onClick={()=> handleSelect("clean", val)}>
                                {val}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="box">
                    <p>혼잡도</p>
                    <div className="option">
                        {["높음", "보통", "낮음"].map((val)=> (
                            <button key={val} className={`op-btn ${scores.crowd === val ? val : ""}`}
                            onClick={()=> handleSelect("crowd", val)}>
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="box">
                    <p>시설상태</p>
                    <div className="option">
                        {["좋음", "보통", "나쁨"].map((val)=> (
                            <button key={val} className={`op-btn ${scores.facility === val ? val : ""}`}
                            onClick={()=> handleSelect("facility", val)}>
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="box">
                    <p>반려동물</p>
                    <div className="option">
                        {["많음", "보통", "적음"].map((val)=> (
                            <button key={val} className={`op-btn ${scores.pet === val ? val : ""}`}
                            onClick={()=> handleSelect("pet", val)}>
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit}> 등록 </button>
            </div>
        </div>
    );
}