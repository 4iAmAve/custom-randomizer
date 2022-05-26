import React, {ChangeEvent, useEffect, useState} from "react";
import debounce from "lodash.debounce";

interface Props {
  onChange: (profile: string) => void;
}

export const Profile = (props: Props) => {
  const [profile, setProfile] = useState<string>('');
  const { onChange } = props;

  useEffect(() => {
    const prevProfile = localStorage.getItem('custom-randomizer::profile');

    if (prevProfile) {
      setProfile(prevProfile);
      handleOnChange(prevProfile);
    }
  }, []);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('custom-randomizer::profile', e.target.value);
    handleOnChange(e.target.value);
    setProfile(e.target.value);
  };

  const handleOnChange = debounce((profile: string) => {
    onChange(profile);
  }, 300);

  return (
    <div className={'input-wrapper'}>
      <input type={'text'} value={profile} onChange={handleProfileChange} />
      <label className={`role-label ${profile.length ? 'small' : ''}`}>Profile</label>
    </div>
  )
}