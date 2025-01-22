// 필요한 라이브러리와 컴포넌트 import
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import * as S from "./Styles/Header.styles";

const MyPage = ({ closeModal }) => {
    const [selectedMenu, setSelectedMenu] = useState('mypage');

    const handlePanelClick = (e) => {
        if(e.target === e.currentTarget){
            closeModal();
        }
    }

    // 사용자 패널 클릭 이벤트 전파 방지
    const handleUserPanelClick = (e) => {
        e.stopPropagation();
    }

    return(
        <S.Panel onClick={handlePanelClick}>
            <S.MyPage onClick={(e) => e.stopPropagation()}>
                <S.UserPanel onClick={handleUserPanelClick}>
                    <S.CloseButton onClick={closeModal}>
                        <AiOutlineClose size={24}/>
                    </S.CloseButton>
                    {/* 숨겨진 파일 입력 */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    {/* 프로필 이미지 */}
                    <S.ProfileImage
                        onClick={handleImageClick}
                        style={{
                            backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                            cursor: 'pointer',
                            width: '90px',
                            height: '90px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    {/* 사용자 정보 표시 */}
                    <S.UserInfo>
                        <S.Name>{nickname}</S.Name>
                        <S.Manners $score={25.1}/>
                    </S.UserInfo>
                </S.UserPanel>
                {/* 메뉴 선택 버튼 */}
                <S.SelectButton>
                    <S.Button
                        onClick={() => setSelectedMenu('mypage')}
                        style={{ fontWeight: selectedMenu === 'mypage' ? 600 : '' }}
                    >
                        마이페이지
                    </S.Button>
                    <S.Button
                        onClick={() => setSelectedMenu('crew')}
                        style={{ fontWeight: selectedMenu === 'crew' ? 600 : '' }}
                    >
                        내 크루
                    </S.Button>
                </S.SelectButton>
                {/* 컨텐츠 영역 */}
                <S.ContentContainer>
                    {/* 마이페이지 컨텐츠 */}
                    {selectedMenu === 'mypage' && (
                        <S.MyPageContent>
                            <p>마이페이지</p>
                        </S.MyPageContent>
                    )}
                    {/* 크루 컨텐츠 */}
                    {selectedMenu === 'crew' && (
                        <S.CrewContent>
                            <S.CrewList>
                                {/* 크루 목록 (최대 5개) */}
                                {[...Array(2)].map((_, index) => (
                                    <S.CrewItem key={index}>
                                        <S.CrewImage/>
                                        <S.CrewName>
                                            크루명
                                        </S.CrewName>
                                        <S.CrewMember>
                                            11/20
                                        </S.CrewMember>
                                    </S.CrewItem>
                                ))}
                            </S.CrewList>
                            {/* 크루 생성 버튼 */}
                            <S.CreateCrewButton to="/crewcreate" onClick={closeModal}>
                                크루 생성
                            </S.CreateCrewButton>
                        </S.CrewContent>
                    )}
                </S.ContentContainer>
            </S.MyPage>
        </S.Panel>
    );
}

export default MyPage;