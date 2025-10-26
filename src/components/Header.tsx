import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";

export type HeaderButtons = "settings" | "dashboard" | "scripts" | "logout";

export type HeaderProps = {
  buttonsToRender: HeaderButtons[];
  sharedIconsStyle: React.CSSProperties;
};

export default function Header({
  buttonsToRender,
  sharedIconsStyle,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="appHeader" style={{ justifyContent: "space-between" }}>
      <div
        style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
      >
        {buttonsToRender.map((item) => {
          switch (item) {
            case "settings":
              return (
                <Box onClick={() => navigate("settings")} key="settings">
                  <SettingsIcon
                    fontSize="medium"
                    style={sharedIconsStyle}
                    className="pointer tinyTiltPointer"
                  />
                </Box>
              );
            case "dashboard":
              return (
                <Box onClick={() => navigate("/dashboard")} key="chat">
                  <ChatIcon
                    fontSize="medium"
                    style={sharedIconsStyle}
                    className="pointer goBluePointer"
                  />
                </Box>
              );
            case "scripts":
              return (
                <Box onClick={() => navigate("scripts")} key="scripts">
                  <DescriptionIcon
                    fontSize="medium"
                    style={sharedIconsStyle}
                    className="pointer goBluePointer"
                  />
                </Box>
              );
            case "logout":
              return (
                <Box
                  onClick={() => {
                    localStorage.removeItem("userId");
                    document.location.reload();
                  }}
                  key="logout"
                >
                  <LogoutIcon
                    fontSize="medium"
                    style={sharedIconsStyle}
                    className="pointer goRedPointer"
                  />
                </Box>
              );
            default:
              throw new Error(`Invalid button to render ${item}`);
          }
        })}
      </div>
    </header>
  );
}
