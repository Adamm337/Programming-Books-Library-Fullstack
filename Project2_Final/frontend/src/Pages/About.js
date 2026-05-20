import './About.css';

const TEAM = [
  { id: 1, name: 'Adam Hamdan',   studentId: '2432126' },
  { id: 2, name: 'Ayman Alzaben', studentId: '2434044' },
  { id: 3, name: 'Mohammed',      studentId: '2439305' },
];

function About() {
  return (
    <div className="about-wrapper">
      <div className="about-card">
        <section className="about-section">
          <h1 className="about-title">Project Overview</h1>
          <p className="about-text">
            This project is a university assignment focused on building a full-stack
            MERN web application. Project 2 extends Project 1 by introducing a
            Node.js/Express back-end, MongoDB database, and full user authentication
            with session management and server-side authorization.
          </p>
          <p className="about-text">
            Built as part of the Web Applications Programming and Engineering course,
            applying concepts including REST APIs, Mongoose schemas, bcrypt password
            hashing, HTTP sessions, and role-based data ownership.
          </p>
        </section>

        <hr className="about-divider" />

        <section className="about-section">
          <h2 className="about-title">Team Information</h2>
          <ul className="about-team">
            {TEAM.map((member) => (
              <li key={member.id} className="about-member">
                <span className="member-name">{member.name}</span>
                <span className="member-id">{member.studentId}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;
