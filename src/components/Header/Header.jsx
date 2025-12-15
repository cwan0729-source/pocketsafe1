import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import "./Header.css";

export default function Header({onSearch, user, onAuthClick }) {
    const [keyword, setKeyword] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter"){
            onSearch(keyword);

            e.target.blur();
        }
    };

    const handleAuthClick =()=>{
        if(!user){
            onAuthClick();
        } else {
            if(window.confirm("로그아웃 하시겠습니까?")) {
                const auth = getAuth();
                signOut(auth);
            }
        }
    };

     return (
        <div className="header-container">
            <h2 className="logo">PocketSafe</h2>

            <div className="search-move">
                <input
                    type="text"
                    placeholder="주소 검색"
                    className="search-input"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button className="Login" onClick={handleAuthClick}>
                    <img src={user ? "/icons/user-on.png" : "/icons/user-off.png"} alt="user" className="user-icon" />
                </button>
            </div>
        </div>
    );
}