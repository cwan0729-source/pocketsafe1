import React, { useEffect, useRef } from "react";
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

                    data.forEach((place)=>{
                        const marker = new window.kakao.maps.Marker({
                            map: map.current, position: new window.kakao.maps.LatLng(place.y, place.x),
                        });

                        window.kakao.maps.event.addListener(marker, "click", ()=>{
                            const input = document.querySelector(".search-input"); //키보드 x
                            if (input) input.blur();

                            console.log("마커 클릭됨", place.place_name);
                            onSelectPlace(place);
                        });
                        markers.current.push(marker);
                    });
                },
                {location}
            );
        });
    };

    useEffect(()=>{
        if(!map.current) return;

        const initCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
        closeplaces(initCenter);
    }, []);

     return <div ref = {mapRef} className="map-container" />;

}