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
    const [ avgScores, setAvgScores] = useState({});
    const [user, setUser] = useState(null);
    const [openAuth, setOpenAuth] = useState(false);
    const [openEstimate,setOpenEstimate] = useState(false);
    
    useEffect(()=> {
        const auth=getAuth();
        const unsub = onAuthStateChanged(auth, (user)=>{
            setUser(user);
        });
        return()=> unsub();
    }, []);


    const PlaceEstimate = async (place) =>{
        setSelectedPlace(place);

        const ratingsRef = collection(db, "places", place.id, "ratings");
        const snapshot = await getDocs(ratingsRef);

        if(snapshot.empty){
            setAvgScores({});
            return;
        }

        let all = {safety:[], clean:[], crowd:[], facility:[], pet:[]};

        snapshot.forEach((doc)=>{
            const d = doc.data();
            Object.keys(all).forEach((key)=>{
                if (d[key]) all[key].push(d[key]);
            });
        });

        const calcAvg = (list) =>{
            if (list.length === 0) return "-";
            const count = {};
            list.forEach((v)=>{ count[v]=(count[v]||0) + 1});
            return Object.entries(count).sort((a, b)=> b[1] - a[1])[0][0];
        };

        setAvgScores({
            safety: calcAvg(all.safety),
            clean: calcAvg(all.clean),
            crowd: calcAvg(all.crowd),
            facility: calcAvg(all.facility),
            pet: calcAvg(all.pet),
        });
    };

    const againAvg = async () =>{
        if(!selectedPlace) return;

        const ratingsRef = collection(db, "places", selectedPlace.id, "ratings");
        const snapshot = await getDocs(ratingsRef);

        if(snapshot.empty){
            setAvgScores({});
            return;
        }

        let all = {safety:[], clean:[], crowd:[], facility:[], pet:[]};

        snapshot.forEach((doc)=>{
            const d = doc.data();
            Object.keys(all).forEach((key)=>{
                if (d[key]) all[key].push(d[key]);
            });
        });

        const calcAvg = (list) =>{
            if (list.length === 0) return "-";
            const count = {};
            list.forEach((v)=>{ count[v]=(count[v]||0) + 1});
            return Object.entries(count).sort((a, b)=> b[1] - a[1])[0][0];
        };

        setAvgScores({
            safety: calcAvg(all.safety),
            clean: calcAvg(all.clean),
            crowd: calcAvg(all.crowd),
            facility: calcAvg(all.facility),
            pet: calcAvg(all.pet),
        });
    };



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
    useEffect(()=>{
        const last = localStorage.getItem("lastSearch");
        if(last) handleSearch(last);
    }, []);

    const SubmitRating = async (scores) => {
        if (!user || !selectedPlace) return;

        const ref = doc(db, "places", selectedPlace.id, "ratings", user.uid);
        await setDoc(ref,{
            ...scores, timestamp: Date.now(),
        });
        alert("평가 저장 완료");
        setOpenEstimate(false);
        againAvg();
    };

    return(
        <div style={{ width: "100%", height: "100vh" , backgroundColor: "#ffffff"}}>
            <Header onSearch={handleSearch} user={user} onAuthClick={()=> {if (!user) {setSelectedPlace(null); setOpenAuth(true);}}}/>
            <MapView center={center} places={places} onSelectPlace={PlaceEstimate}/>

            {openAuth && (<Login onClose={()=> setOpenAuth(false)}/>)}
            {selectedPlace && ( <PlaceInfo place={selectedPlace} Close={()=> setSelectedPlace(null)}
                avgScores={avgScores} user={user} onOpenEstimate={()=> setOpenEstimate(true)}/*onRatingSaved={againAvg}*//>
            
            )}
            {openEstimate && selectedPlace && (<Estimate close={()=> setOpenEstimate(false)} onSubmit={SubmitRating}/>)}
        </div>
    );
}

export default MainPage;
