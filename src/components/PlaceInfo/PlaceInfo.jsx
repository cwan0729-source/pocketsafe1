import { useState } from "react";
import "./PlaceInfo.css";
import { useNavigate} from "react-router-dom";

export default function PlaceInfo ({
    place, Close, mostScores={}, user, onOpenEstimate, 
}) {

    const navigate = useNavigate();
    
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
                      <span className={`level ${mostScores.safety ? mostScores.safety : "empty"}`}>{mostScores.safety ?? "-"}</span>
                 </div>
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">청결도</span>
                    <span className={`level ${mostScores.clean ? mostScores.clean : "empty"}`}>{mostScores.clean ?? "-"}</span>
                </div>   
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">혼잡도</span>
                    <span className={`level ${mostScores.crowd ? mostScores.crowd : "empty"}`}>{mostScores.crowd ?? "-"}</span>
                </div>    
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">시설상태</span>  
                    <span className={`level ${mostScores.facility ? mostScores.facility : "empty"}`}>{mostScores.facility ?? "-"}</span>
                </div> 
                <div className="line-2"></div>

                <div className="list-row">
                    <span className="label">반려동물</span>
                    <span className={`level ${mostScores.pet ? mostScores.pet : "empty"}`}>{mostScores.pet ?? "-"}</span>
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
                                        } onOpenEstimate();
                                        }}> 평가하기</button>
                
            </div>
            
        </div>
    );
}


