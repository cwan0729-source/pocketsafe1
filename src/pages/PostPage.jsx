import { useEffect, useState} from "react";
import { useParams, useLocation} from "react-router-dom";
import { collection, addDoc, getDocs, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import "./PostPage.css";

export default function PostPage() {
    const { placeId } = useParams();
    const { state } = useLocation();
    const place = state?.place;

    const auth = getAuth();
    const [user, setUser ] = useState(null);
    const [posts, setPosts ] = useState([]);
    const [sort, setSort] = useState("latest");
    const [openModal, setOpenModal]= useState(false);
    const [text, setText]=useState("");

    const fetchPosts = async () => {
        const q = query(collection(db, "places", placeId, "posts"));
        const snapshot = await getDocs(q);
        let postList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        if(sort === "latest"){
            postList.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
        } else if (sort === "likes"){
            postList.sort((a, b)=> (b.likes?.length || 0) - (a.likes?.length || 0));
        }
        setPosts(postList);
    };

    useEffect(()=>{
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (u)=>{
            setUser(u);
        });
        return()=> unsub();
    }, []);

    useEffect(()=> {
        fetchPosts();
    }, [sort]);

    const handleUpload = async () => {
        if(!user){
            alert("로그인 후 작성 가능합니다.");
            return;
        }

        const userId = user.uid || "unknown";

        await addDoc(collection(db, "places", placeId, "posts"), {
            text, userId: user.uid, userEmail: user.email,
            createdAt: new Date(), likes: []
        });

        setOpenModal(false);
        setText("");
        fetchPosts();
    };

    const handleDelete = async (post)=>{
        if (!user || user.uid !== post.userId) return;

        if (!window.confirm("게시글을 삭제할까요?")) return;

        const ref = doc(db, "places", placeId, "posts", post.id);
        await deleteDoc(ref);
        fetchPosts();
    };

    const toggleLike = async(post)=>{
        if (!user || !user.uid) return alert("로그인하세요.");
        const userId = user.uid;
        
        let newLikes = post.likes ? [...post.likes] : [];
        if( newLikes.includes(userId)){
            newLikes = newLikes.filter(id => id !== userId);
        } else {
            newLikes.push(userId);
        }

        newLikes = newLikes.filter(id => id !== undefined && id !== null);

        const postRef = doc(db, "places", placeId, "posts", post.id);
        await updateDoc(postRef, { likes:newLikes});
        fetchPosts();
    };

    return(
        <div className="post-page">
            <h2 className="pp-logo">PocketSafe</h2>

            <div className="post-title">
                {place?.place_name} 게시글
            </div>

            <div className="post-top">
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="latest">최신순</option>
                    <option value = "likes">공감순</option>
                </select>
                <button className ="write-btn" onClick={()=> setOpenModal(true)}>등록</button>
            </div>

            <div className="post-grid">
                {posts.length === 0 && <p>아직 게시글이 없습니다.</p>}

                {posts.map(post=>(
                    <div className="post-card" key={post.id}>
                        <p className="writer">{post.userEmail}</p>
                        <p>{post.text}</p>
                        <div className="h-d">
                            <div className="heart" onClick={()=> toggleLike(post)} role="button" tabIndex={0}>
                                {post.likes?.includes(user?.uid) ? "❤️" : "🤍"} {post.likes?.length || 0}
                            </div>
                            {user?.uid === post.userId && (
                                <button className="delete-btn" onClick={()=> handleDelete(post)}>
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {openModal && (
                <div className="overlay">
                    <div className="modal">
                        <button className="close" onClick={()=> setOpenModal(false)}>x</button>
                        <textarea placeholder="한 줄 설명" value={text} onChange={e => setText(e.target.value)} />
                        <button onClick={handleUpload}>등록</button>
                    </div>
                </div>
            )}
        </div>
    );
}