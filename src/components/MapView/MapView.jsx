import { useEffect, useRef } from "react";
import "./MapView.css";

export default function MapView({ center, onSelectPlace }) {
    const mapRef = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);

    //지도 생성
    useEffect(()=>{
        if (!window.kakao) return;

        window.kakao.maps.load(()=>{
            if (!map.current) {
                map.current = new window.kakao.maps.Map(mapRef.current,{
                center: new window.kakao.maps.LatLng(center.lat, center.lng),level: 4,
             });
                closeplaces(
                    new window.kakao.maps.LatLng(center.lat, center.lng)
                );
            }
        });
    }, []);

    //지도이동 주변 공원/놀이터 검색
    useEffect(()=>{
        if(!map.current) return;

        const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
        map.current.setCenter(newCenter);

        closeplaces(newCenter);
    },[center]);

    //주변 장소 자동 검색
    const closeplaces = (location) =>{
        const ps = new window.kakao.maps.services.Places();

        const keywords = ["공원", "놀이터", "어린이공원"];

        //기존 마커 삭제
        markers.current.forEach((m) => m.setMap(null));
        markers.current = [];

        keywords.forEach((keyword) =>{
            ps.keywordSearch(
                keyword,
                (data, status)=>{
                    if(status !== window.kakao.maps.services.Status.OK) return;

                    data.forEach((place)=>{ //검색된 장소마다 마커 찍음
                        const marker = new window.kakao.maps.Marker({
                            map: map.current, position: new window.kakao.maps.LatLng(place.y, place.x),
                        });
                        //마커 클릭 이벤트
                        window.kakao.maps.event.addListener(marker, "click", ()=>{
                            const input = document.querySelector(".search-input"); //키보드 x
                            if (input) input.blur();

                            onSelectPlace(place); //선택된 장소 데이터를 MainPage로 전달
                        });
                        markers.current.push(marker);
                    });
                },
                {location}
            );
        });
    };
    //카카오맵이 SDK로딩이 비동기가 지도생성 시점 불안정(한번안뜬적있음) 안전장치로 한번 더 주변 장소 탐색
    useEffect(()=>{
        if(!map.current) return;

        const initCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
        closeplaces(initCenter);
    }, []);

     return <div ref = {mapRef} className="map-container" />;

}