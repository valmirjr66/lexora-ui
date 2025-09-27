import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Modal, styled, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ChangePasswordModal from "../components/ChangePasswordModal";
import Footer from "../components/Footer";
import Header, { HeaderButtons } from "../components/Header";
import useToaster from "../hooks/useToaster";
import defaultAvatar from "../imgs/ic-me.svg";
import loadingIcon from "../imgs/loading.gif";
import httpCallers from "../service";
import { User } from "../types";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingProfilePic, setUpdatingProfilePic] = useState<boolean>(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] =
    useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const { triggerToast: triggerToastError } = useToaster({ type: "error" });
  const { triggerToast: triggerToastSuccess } = useToaster({ type: "success" });

  const profilePicsBaseAddress = import.meta.env
    .VITE_PROFILE_PICS_STORAGE_BASE_ADDRESS;

  const loadUser = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const { data } = await httpCallers.get(`users/${userId}`);

      let birthdate: Date;

      if (data.birthdate) {
        const [birthdateYear, birthdateMonth, birthdateDay] = data.birthdate
          .split("-")
          .map((x: string) => Number(x));

        birthdate = new Date(birthdateYear, birthdateMonth - 1, birthdateDay);
      }

      setUser({
        id: data.id,
        fullname: data.fullname,
        email: data.email,
        profilePicFileName: data.profilePicFileName,
        birthdate: birthdate,
      });
    } catch {
      triggerToastError(
        "Something wen't wrong while fetching user info, please try again 😟"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      await httpCallers.put(`/users/${userId}`, {
        email: user.email,
        fullname: user.fullname,
        birthdate: user.birthdate?.toISOString().split("T")[0],
      });

      triggerToastSuccess("Information updated successfully!");
    } catch {
      triggerToastError();
    } finally {
      setEditMode(false);
    }
  };

  const cancelUpdate = async () => {
    setEditMode(false);
    setLoading(true);
    await loadUser();
    setLoading(false);
  };

  const [isProfilePicDialogOpen, setIsProfilePicDialogOpen] = useState(false);

  const openProfilePicDialog = () => setIsProfilePicDialogOpen(true);

  const closeProfilePicDialog = () => setIsProfilePicDialogOpen(false);

  const replaceProfilePic = async (event: ChangeEvent<HTMLInputElement>) => {
    setUpdatingProfilePic(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", event.target.files[0]);

      const userId = localStorage.getItem("userId");
      await httpCallers.put(`/users/${userId}/profile-picture`, formData, {
        "Content-Type": "multipart/form-data",
      });

      await loadUser();
      triggerToastSuccess("Profile picture updated successfully!");
      closeProfilePicDialog();
    } catch {
      triggerToastError(
        "Something went wrong while updating profile picture 😟"
      );
    } finally {
      setUpdatingProfilePic(false);
    }
  };

  const removeProfilePic = async () => {
    const userId = localStorage.getItem("userId");
    await httpCallers.delete(`/users/${userId}/profile-picture`);
    await loadUser();
    closeProfilePicDialog();
  };

  const headerButtons: HeaderButtons[] = ["logout", "dashboard"];

  if (user === null) {
    return (
      <main className="app">
        <Header
          buttonsToRender={headerButtons}
          sharedIconsStyle={{ marginRight: 25 }}
        />
        <div className="appWrapper">
          <section className="settingsContent">
            <img src={loadingIcon} width={30} />
          </section>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <Modal open={isProfilePicDialogOpen} onClose={closeProfilePicDialog}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#323232",
            boxShadow: 24,
            p: 4,
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <span style={{ marginBottom: 20, display: "block", fontSize: 14 }}>
            {updatingProfilePic
              ? "Updating..."
              : "What you want to do with your profile picture?"}
          </span>
          {updatingProfilePic ? (
            <img src={loadingIcon} width={30} />
          ) : (
            <div>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                style={{ marginRight: 24 }}
              >
                Replace
                <VisuallyHiddenInput
                  type="file"
                  onChange={replaceProfilePic}
                  multiple
                />
              </Button>
              <Button
                component="label"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={removeProfilePic}
              >
                Remove
              </Button>
            </div>
          )}
        </Box>
      </Modal>

      <ToastContainer />
      <ChangePasswordModal
        isOpen={passwordModalIsOpen}
        handleClose={() => setPasswordModalIsOpen(false)}
      />
      <main className="app">
        <Header
          buttonsToRender={headerButtons}
          sharedIconsStyle={{ marginRight: 25 }}
        />
        <div className="appWrapper">
          <section className="settingsContent">
            {loading ? (
              <img src={loadingIcon} width={30} />
            ) : (
              <form
                onSubmit={submitForm}
                className="settingsPanel"
                style={{ minHeight: 550, height: "calc(50% + 50px)" }}
              >
                <div
                  className="profilePicContainer"
                  onClick={openProfilePicDialog}
                >
                  <img
                    src={
                      user.profilePicFileName
                        ? `${profilePicsBaseAddress}/${user.profilePicFileName}`
                        : defaultAvatar
                    }
                    alt="Avatar"
                    className="profilePicImg"
                  />
                  <div className="profilePicOverlay">
                    <EditIcon style={{ color: "white" }} />
                  </div>
                </div>
                <TextField
                  label="Fullname"
                  value={user.fullname}
                  fullWidth
                  disabled={!editMode}
                  required
                  onChange={(e) =>
                    setUser((prevState) => ({
                      ...prevState,
                      fullname: e.target.value,
                    }))
                  }
                />
                <DatePicker
                  label="Birthdate"
                  value={dayjs(new Date(user.birthdate))}
                  disabled={!editMode}
                  slotProps={{ textField: { required: true } }}
                  onChange={(e) =>
                    setUser((prevState) => ({
                      ...prevState,
                      birthdate: new Date(e.toISOString()),
                    }))
                  }
                />
                <TextField
                  label="E-mail"
                  value={user.email}
                  disabled
                  required
                  fullWidth
                />
                {!editMode && (
                  <a
                    href="#"
                    style={{ fontSize: 12 }}
                    onClick={() => setPasswordModalIsOpen(true)}
                  >
                    Change password
                  </a>
                )}
                {editMode ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      type="submit"
                      style={{ width: 150 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ width: 150 }}
                      onClick={cancelUpdate}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    color="primary"
                    variant="contained"
                    style={{ width: 150 }}
                    onClick={() => setEditMode(true)}
                    startIcon={<EditIcon fontSize="small" />}
                  >
                    Edit
                  </Button>
                )}
              </form>
            )}
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}
