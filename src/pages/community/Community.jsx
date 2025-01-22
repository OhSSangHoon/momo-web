import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from "./Styles/Community.styles";

const Community = () => {
    const navigate = useNavigate();
    // 초기 게시물 데이터 추후 API로 데이터 받아오기
    const initialPosts = Array.from({ length: 12 }, (_, index) => ({
        id: index,
        title: `오늘은 초코러닝 ${index}차 정모에 총 20명이나 참여를 했습니다.`,
    }));

    // 게시물과 보이는 게시물 수를 저장하는 상태
    const [posts, setPosts] = useState(initialPosts);
    const [visiblePosts, setVisiblePosts] = useState(2);
    const observerRef = useRef();

    useEffect(() => {
        // IntersectionObserver를 사용하여 관찰 요소가 보일 때 더 많은 게시물을 로드
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visiblePosts < posts.length) {
                    setVisiblePosts(prev => prev + 1);
                }
            },
            { threshold: 0.5 }
        );

        // observerRef 요소를 관찰
        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        // 컴포넌트 언마운트 시 옵저버 정리
        return () => observer.disconnect();
    }, [visiblePosts, posts.length]);

    // 게시물 제목을 잘라주는 함수
    const truncateTitle = (title) => {
        return title.length > 23 ? `${title.substring(0, 23)} ··· ` : title;
    };

    return(
        <S.Container>
            <Banner />
            <S.List>
                <S.FloatingButton onClick={() => navigate('/crew/crewCommunity/write')} />
                {posts.slice(0, visiblePosts).map((post, index) => (
                <S.ActivityCard key={post.id}>
                    <S.UserInfoContainer>
                        <S.ProfileImage/>
                        <S.UserName>러닝초보123</S.UserName>
                        {/* 작성일은 현재 시간 - 작성 시간으로 계산 */}
                        <S.Date> · 1일</S.Date>
                    </S.UserInfoContainer>
                    <S.ActivityImage to={`/crew/crewCommunity/${post.id}`}/>
                    <S.PostInfoContainer>
                        <S.ButtonsContainer>
                            {/* uid를 통해 좋아요는 한번만 가능하도록 설정 */}
                            <S.IconButton>
                                ♥️
                            </S.IconButton>
                            <S.IconButton>
                                💬
                            </S.IconButton>
                        </S.ButtonsContainer>
                        <S.TextContainer>
                            <S.UserName>러닝초보123</S.UserName>
                            <S.Title to={`/crew/crewCommunity/${post.id}`}>{truncateTitle(post.title)}</S.Title>
                        </S.TextContainer>
                    </S.PostInfoContainer>
                </S.ActivityCard>
                ))}
                {/*
                    사용자가 스크롤을 내려 div가 화면에서 보이면 observer가 div를 감지하고
                    추가 게시글 1개씩 불러오도록 하는 trigger
                */}
                {visiblePosts < posts.length && (
                    // observer를 작동하기 위한 감지점
                    <div ref={observerRef} style={{
                        height: '1px',
                        margin: '0',
                        padding: '0'
                    }} />
                )}
            </S.List>
        </S.Container>
    );
};


export default Community;