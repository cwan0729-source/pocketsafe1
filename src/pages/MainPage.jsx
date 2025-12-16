import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import {db} from "../firebase";
import { collection, getDocs, doc, setDoc} from "firebase/firestore";
import Header from "../components/Header/Header";
import MapView from "../components/MapView/MapView";
import PlaceInfo from "../components/PlaceInfo/PlaceInfo";
import Login from "../components/Login/Login";
import Estimate from "../components/Estimate/Estimate";

function MainPage() {
    const [ center, setCenter ] = useState({ lat: 37.5665, lng: 126.9780});
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [ mostScores, setMostScores] = useState({});
    const [user, setUser] = useState(null);
    const [openAuth, setOpenAuth] = useState(false);
    const [openEstimate,setOpenEstimate] = useState(false);
    
    //로그인/로그아웃 user 자동 갱신
    useEffect(()=> {
        const auth=getAuth();
        const unsub = onAuthStateChanged(auth, (user)=>{
            setUser(user);
        });
        return()=> unsub();
    }, []);


    const PlaceEstimate = async (place) =>{
        setSelectedPlace(place);

        //사람들이 평가한 내용들 가져옴
        const ratingsRef = collection(db, "places", place.id, "ratings");
        const snapshot = await getDocs(ratingsRef);

        //평가 없으면 종료
        if(snapshot.empty){
            setMostScores({});
            return;
        }

        //항목별 평가 모으기 통
        let all = {safety:[], clean:[], crowd:[], facility:[], pet:[]};

        //평가를 꺼낸 후 항목별 확인하고 있으면 해달 배열에 추가
        snapshot.forEach((doc)=>{
            const d = doc.data(); 
            Object.keys(all).forEach((key)=>{
                if (d[key]) all[key].push(d[key]);
            });
        });

        //가장 많이 나온 값 선택
        const getMostSelected = (list) =>{
            if (list.length === 0) return "-";
            const count = {};
            list.forEach((v)=>{ count[v]=(count[v]||0) + 1}); //ex "좋음":3, "보통":1
            return Object.entries(count).sort((a, b)=> b[1] - a[1])[0][0]; //내림차순
        };

        //최종 저장
        setMostScores({
            safety: getMostSelected(all.safety),
            clean: getMostSelected(all.clean),
            crowd: getMostSelected(all.crowd),
            facility: getMostSelected(all.facility),
            pet: getMostSelected(all.pet),
        });
    };

    // 평가 저장 후 최신 결과 실시간 반영용
    const againMost = async () =>{
        if(!selectedPlace) return;

        const ratingsRef = collection(db, "places", selectedPlace.id, "ratings");
        const snapshot = await getDocs(ratingsRef);

        if(snapshot.empty){
            setMostScores({});
            return;
        }

        let all = {safety:[], clean:[], crowd:[], facility:[], pet:[]};

        snapshot.forEach((doc)=>{
            const d = doc.data();
            Object.keys(all).forEach((key)=>{
                if (d[key]) all[key].push(d[key]);
            });
        });

        const getMostSelected = (list) =>{
            if (list.length === 0) return "-";
            const count = {};
            list.forEach((v)=>{ count[v]=(count[v]||0) + 1});
            return Object.entries(count).sort((a, b)=> b[1] - a[1])[0][0];
        };

        setMostScores({
            safety: getMostSelected(all.safety),
            clean: getMostSelected(all.clean),
            crowd: getMostSelected(all.crowd),
            facility: getMostSelected(all.facility),
            pet: getMostSelected(all.pet),
        });
    };


    //키워드로 장소 검색 + 중심 이동 + 검색된 장소 state 저장
    const handleSearch = (keyword) => {
        if (!keyword) return;

        localStorage.setItem("lastSearch", keyword);

        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services){
            console.log("카카오맵 아직 로딩 중");
            return;
        }

        const ps= new window.kakao.maps.services.Places();
        ps.keywordSearch(keyword, (data, status) => {
            if(status === window.kakao.maps.services.Status.OK){

                //지도 중심
                const first = data[0];
                setCenter({ lat: first.y, lng: first.x});

                setPlaces(data);
            }   
         });
    };
    //마지막 클릭한 지도 위치 저장
    useEffect(()=>{
        const last = localStorage.getItem("lastSearch");
        if(last) handleSearch(last);
    }, []);

    const SubmitRating = async (scores) => {
        if (!user || !selectedPlace) return;

        const ref = doc(db, "places", selectedPlace.id, "ratings", user.uid); //1인당 1번 평가
        await setDoc(ref,{
            ...scores, timestamp: Date.now(),
        });
        alert("평가 저장 완료");
        setOpenEstimate(false);
        againMost(); //실시간 반영
    };

    return(
        <div style={{ width: "100%", height: "100vh" , backgroundColor: "#ffffff"}}>
            <Header onSearch={handleSearch} user={user} onAuthClick={()=> {if (!user) {setSelectedPlace(null); setOpenAuth(true);}}}/>
            <MapView center={center} places={places} onSelectPlace={PlaceEstimate}/>

            {openAuth && (<Login onClose={()=> setOpenAuth(false)}/>)}
            {selectedPlace && ( <PlaceInfo place={selectedPlace} Close={()=> setSelectedPlace(null)}
                mostScores={mostScores} user={user} onOpenEstimate={()=> setOpenEstimate(true)}/>
            
            )}
            {openEstimate && selectedPlace && (<Estimate close={()=> setOpenEstimate(false)} onSubmit={SubmitRating}/>)}
        </div>
    );
}

export default MainPage;
