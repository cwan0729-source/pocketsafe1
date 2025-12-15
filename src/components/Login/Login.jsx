import { useState} from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import "./Login.css";

export default function Login({ onClose, onLogin}) {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const[pw, setPw] = useState("");
    const [pw2,setPw2] = useState("");

    const auth = getAuth();

    const handleSubmit = async() =>{
        
        if(mode === "signup"){
            if (pw !== pw2){
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
            try {
                await createUserWithEmailAndPassword(auth, email, pw);
                alert("회원가입 완료. 로그인 해주세요.");
                setMode("login");
            } catch(err) {
                alert(err.message);
            }
            return;
            
        }

        try{
            await signInWithEmailAndPassword(auth, email, pw);
            alert("로그인 성공");
            onClose();
        } catch (err){
            alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    return (
        <div className = "overlay">
            <div className="modal">
                <button className ="close" onClick={onClose}>x</button>

                <h3 className="title">
                    {mode === "login" ? "로그인" : "회원가입"}
                </h3>

                <input className="input" placeholder="이메일" value={email}
                        onChange ={(e)=> setEmail(e.target.value)} />

                <input className="input" type="password" placeholder="비밀번호" value={pw}
                        onChange ={(e)=> setPw(e.target.value)} />

                {mode === "signup" && (
                    <input className="input" type="password" placeholder="비밀번호 확인"
                            value ={pw2} onChange={(e)=> setPw2(e.target.value)} />
                )}

                <div className="btn">
                    <button className="sign-up" onClick={()=> setMode(mode === "login" ? "signup" : "login")}>
                        {mode === "login" ? "회원가입" : "뒤로"}
                    </button>
                    <button className="submit" onClick={handleSubmit}>
                        {mode === "login" ? "로그인" : "가입하기"}
                    </button>
                </div>
            </div>
        </div>
    )
}