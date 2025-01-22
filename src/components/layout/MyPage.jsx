import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import * as S from "./Styles/Header.styles";


const MyPage = ({ closeModal }) => {
    // 상태 관리
    const [selectedMenu, setSelectedMenu] = useState('crew'); // 선택된 메뉴 (마이페이지/내크루)
    const { userInfo, setUserInfo } = useAuth(); // 전역 사용자 정보
    const [nickname, setNickname] = useState(''); // 사용자 닉네임
    const [profileImage, setProfileImage] = useState(''); // 프로필 이미지 URL
    const fileInputRef = useRef(null); // 파일 입력 참조
    const [showGenderSelect, setShowGenderSelect] = useState(false); // 성별 선택
    const [age, setAge] = useState(''); // 나이 입력값
    const [showAgeInput, setShowAgeInput] = useState(false); // 나이 입력
    const [loading, setLoading] = useState(true);

    // 사용자 정보가 변경될 때마다 상태 업데이트
    useEffect(() => {
        if (userInfo) {
            setNickname(userInfo.nickname || '');
            setProfileImage(userInfo.profileImage || '');
            setLoading(false);
        }
    }, [userInfo]);

    // 프로필 이미지 업로드 처리
    const handleProfileImageUpload = async (file) => {
        if (!file) return;
    
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }
    
        const formData = new FormData();
        formData.append('profileImage', file);
    
        try {
            const response = await authAPI.uploadProfileImage(formData);
            const imageUrl = response.data.data;
    
            // 전역 유저 정보 업데이트
            if (userInfo) {
                const updatedUserInfo = {
                    ...userInfo,
                    profileImage: imageUrl
                };
                setUserInfo(updatedUserInfo);
                // localStorage 업데이트
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            }
    
            alert('프로필 이미지가 업데이트되었습니다.');
        } catch (error) {
            console.error('프로필 이미지 업로드 실패:', error);
            alert('프로필 이미지 업로드에 실패했습니다.');
        }
    };

    // 이미지 클릭 시 파일 선택 다이얼로그 열기
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 시 이미지 업로드 처리
    // 구조분할당 코드 수정
    const handleProfileImageChange = (e) => {
        const [file] = e.target.files;
        handleProfileImageUpload(file);
    };

    // 사용자 정보 업데이트 처리
    // gender, age 함수의 중복 코드를 제거하고 사용자 정보 업데이트 로직을
    // 한 곳에서 관리 하도록 refactoring
    const handleUserInfoUpdate = async (updateData) => {
        try {
            const response = await authAPI.updateUserInfo({
                nickname: userInfo.nickname,
                cp: userInfo.cp,
                gender: userInfo.gender,
                age: userInfo.age,
                profileImage: userInfo.profileImage,
                ...updateData
            });

            if(response.data.data){
                const updatedUserInfo = {...userInfo, ...response.data.data};
                setUserInfo(updatedUserInfo);
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                return true;
            }
        } catch (error) {
            console.error('사용자 정보 업데이트 실패:', error);
            alert('사용자 정보 업데이트에 실패했습니다.');
            return false;
        }
    }

    // 성별 선택 처리
    const handleGenderSelect = async (gender) => {
        const success = await handleUserInfoUpdate({gender});
        if(success){
            setShowGenderSelect(false);
        }
    };

    // 나이 선택 처리
    const handleAgeSubmit = async () => {
        if(!age || age < 1 || age > 100){
            alert('1-100 사이의 나이를 입력해주세요.');
            return;
        }

        const success = await handleUserInfoUpdate({age});
        if(success){
            setShowAgeInput(false);
            setAge('');
        }
    };

    // 성별 표시 텍스트 변환
    const displayGender = (gender) => {
        if(!gender) return '성별 선택';
        return gender === 'M' ? '남성' : '여성';
    }


    // 모달 외부 클릭 시 닫기
    const handlePanelClick = (e) => {
        if(e.target === e.currentTarget){
            closeModal();
        }
    }

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
                    {/* 프로필 이미지 */}
                    <S.ProfileImage/>
                    {/* 사용자 닉네임 or 이름 */}
                    <S.UserInfo>
                        <S.Name>김매너</S.Name>
                        {/* 매너점수를 score에 넣어 출력 */}
                        <S.Manners score={25.1}/>
                    </S.UserInfo>
                </S.UserPanel>
                <S.SelectButton>
                    <S.Button
                        onClick={() => setSelectedMenu('mypage')}
                        className={selectedMenu === 'mypage' ? 'active': ''}
                    >
                        마이페이지
                    </S.Button>
                    <S.Button
                        onClick={() => setSelectedMenu('crew')}
                        className={selectedMenu === 'crew' ? 'active': ''}
                    >
                        내 크루
                    </S.Button>
                </S.SelectButton>
                <S.ContentContainer>
                    {selectedMenu === 'mypage' && (
                        <S.MyPageContent>
                            <S.UserInfoContainer>
                                <S.infoTitle>이메일:</S.infoTitle> {userInfo.email}
                            </S.UserInfoContainer>
                            <S.UserInfoContainer>
                                <S.infoTitle>닉네임:</S.infoTitle> {userInfo.nickname}
                            </S.UserInfoContainer>
                            <S.UserInfoContainer>
                                <S.infoTitle>전화번호:</S.infoTitle> {userInfo.cp}
                            </S.UserInfoContainer>
                            {/* 성별 정보 */}
                            <S.UserInfoContainer>
                                <S.infoTitle>성별:</S.infoTitle>
                                {showGenderSelect ? (
                                    <S.GenderSelectContainer>
                                        <S.GenderButton onClick={() => handleGenderSelect('M')}>남성</S.GenderButton>
                                        <S.GenderButton onClick={() => handleGenderSelect('F')}>여성</S.GenderButton>
                                    </S.GenderSelectContainer>
                                ) : (
                                    <>
                                        <S.infoTitle>{displayGender(userInfo?.gender)}</S.infoTitle>
                                        {!userInfo?.gender && (
                                            <S.EditButton onClick={() => setShowGenderSelect(true)}>
                                                수정
                                            </S.EditButton>
                                        )}
                                    </>
                                )}
                            </S.UserInfoContainer>
                            {/* 나이 정보 */}
                            <S.UserInfoContainer>
                                <S.infoTitle>나이:</S.infoTitle>
                                {showAgeInput ? (
                                    <S.AgeInputContainer>
                                        <S.AgeInput
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            min="1"
                                            max="100"
                                        />
                                        <S.SubmitButton onClick={handleAgeSubmit}>
                                            확인
                                        </S.SubmitButton>
                                    </S.AgeInputContainer>
                                ) : (
                                    <>
                                        <span>{userInfo?.age || '미설정'}</span>
                                        {(!userInfo?.age || userInfo?.age === 0) && (
                                            <S.EditButton onClick={() => setShowAgeInput(true)}>
                                                수정
                                            </S.EditButton>
                                        )}
                                    </>
                                )}
                            </S.UserInfoContainer>
                        </S.MyPageContent>
                    )}
                    {selectedMenu === 'crew' && (
                        <S.CrewContent>
                            <S.CrewList>
                                {/* 크루는 최대 5개까지만 들어갈 수 있다. */}
                                {[...Array(2)].map((_, index) => (
                                    // 해당 크루 페이지로 이동할 수 있도록 추후 수정
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