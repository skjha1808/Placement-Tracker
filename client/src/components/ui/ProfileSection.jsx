function ProfileSection({ title, children }) {
    return (
        <div className="card profile-section">
            <h2>{title}</h2>

            {children}
        </div>
    );
}

export default ProfileSection;