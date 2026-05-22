
import './App.css';
import GeminiChat from './GeminiChat';

import chatgptLogo from './assets/chatgptLogo.svg';
import addIcon from './assets/add-30.png';
import homeIcon from './assets/home.svg';
import messageIcon from './assets/message.svg';
import rocketIcon from './assets/rocket.svg';
import bookmarkIcon from './assets/bookmark.svg';
import userIcon from './assets/user-icon.png';

export default function App() {
  return (
    <div className="appRoot">
      <aside className="sidebar">
        <div className="sidebarTop">
          <div className="sidebarLogo">
            <img className="sidebarLogoImg" src={chatgptLogo} alt="ChatGPT" />
          </div>
          <button className="newChatBtn" type="button" aria-label="New chat">
            <img className="newChatIcon" src={addIcon} alt="new" />
            <span>New chat</span>
          </button>
        </div>

        <nav className="sidebarNav" aria-label="Sidebar">
          <a className="navItem" href="#">
            <img className="navIcon" src={homeIcon} alt="home" />
            <span>Home</span>
          </a>
          <a className="navItem" href="#">
            <img className="navIcon" src={messageIcon} alt="messages" />
            <span>Messages</span>
          </a>
        </nav>

        <div className="sidebarBottom">
          <div className="planCard" aria-hidden="true">
            <img className="planIcon" src={rocketIcon} alt="" />
            <div className="planText">
              <div className="planTitle">Upgrade to Plus</div>
              <div className="planSubtitle">More speed & features</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbarLeft">
            <div className="chatTitle">ChatGPT</div>
          </div>
          <div className="topbarRight">
            <button className="topIconBtn" type="button" aria-label="Bookmark">
              <img className="topIcon" src={bookmarkIcon} alt="bookmark" />
            </button>
            <div className="avatarWrap" aria-hidden="true">
              <img className="avatar" src={userIcon} alt="user" />
            </div>
          </div>
        </header>

        <section className="chatPane">
          <GeminiChat className="chatShell" />
        </section>
      </main>
    </div>
  );
}

