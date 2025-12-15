import { useState } from "react";
import { db} from "../../firebase";
import { doc, setDoc} from "firebase/firestore";
import "./PlaceInfo.css";
//import Estimate from "../Estimate/Estimate";
import { useNavigate} from "react-router-dom";

export default function PlaceInfo ({
    place, Close, avgScores={}, user, onOpenEstimate, //onRatingSaved
}) {

    const [/*openEstimate,*/ setOpenEstimate ]= useState(false);
    const navigate = useNavigate();
    
     /* const saveRating = async(scores) =>{
        if(!user || !user.uid){
            alert("로그인 후 평가할 수 있습니다.");
            return;
        }
        const ref = doc(db, "places", place.id, "ratings", user.uid);
        await setDoc(ref, {
            ...scores, timestamp: Date.now(),
        });
        alert ("평가 저장 완료");

    };*/

    /*const SubmitRating = async (scores) => {
        console.log("평가 저장", scores);
        await saveRating(scores);
        onRatingSaved();
    }*/

    if (!place) return null;

    return (
        <div className = "place-info-container">
            <div className ="top">
                <h2 className="p-name">{place.place_name}</h2>
                <button className="P-close" onClick={Close}>X</button>
                
            </div>

            <div className="line"></div>

            <div className="list">
                 <div className="list-row">
                     <span className="label">안전도</span>
                      <span className={`level ${avgScores.safety}`}>{avgScores.safety ?? "-"}</span>
                 </div>
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">청결도</span>
                    <span className={`level ${avgScores.clean}`}>{avgScores.clean ?? "-"}</span>
                </div>   
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">혼잡도</span>
                    <span className={`level ${avgScores.crowd}`}>{avgScores.crowd ?? "-"}</span>
                </div>    
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">시설상태</span>  
                    <span className={`level ${avgScores.facility}`}>{avgScores.facility ?? "-"}</span>
                </div> 
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">반려동물</span>
                    <span className={`level ${avgScores.pet}`}>{avgScores.pet ?? "-"}</span>
                </div>

            </div>
                    
            <div className ="btn-area">
                <button className="post-btn"
                        onClick={()=> navigate(`/place/${place.id}`,{
                                        state: {place},
                                    })}> 게시글 이동</button>
                <button className="estimate-btn"
                        onClick={()=> { if(!user) {
                                        alert ("로그인 후 평가할 수 있어요");
                                        return;
                                        } onOpenEstimate(); //setOpenEstimate(true);
                                        }}> 평가하기</button>
                
            </div>
            
        </div>
    );
}

//{openEstimate && (<Estimate place={place} close={()=> setOpenEstimate(false)} onSubmit={SubmitRating}/>)}
