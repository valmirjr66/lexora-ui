import { MenuItem, Select, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import { SCRIPT_BLOCK_TYPES } from "../constants";
import httpCallers from "../service";
import { DecoratedScript, ScriptBlockType } from "../types";

export default function Scripts() {
  const { t } = useTranslation();

  const [scripts, setScripts] = useState<DecoratedScript[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

  const selectedScript = useMemo(() => {
    return scripts.find((item) => item.id === selectedScriptId);
  }, [selectedScriptId, scripts]);

  const fetchScripts = useCallback(async () => {
    const { data } = await httpCallers.get("scripts");

    setScripts(data.items);
  }, []);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  const changeScriptBlockType = useCallback(
    (blockId: string, newType: ScriptBlockType) => {
      if (!selectedScriptId) return;

      setScripts((prevState) => {
        const newState = prevState;

        const scriptToUpdate = newState.find(
          (item) => item.id === selectedScriptId
        );

        scriptToUpdate.blocks = scriptToUpdate.blocks.map((item) =>
          item.id === blockId ? { ...item, type: newType } : item
        );

        return newState;
      });
    },
    [selectedScriptId, setScripts]
  );

  return (
    <main className="app">
      <ToastContainer />
      <Header
        buttonsToRender={["dashboard", "settings"]}
        sharedIconsStyle={{ marginRight: 25 }}
      />
      <div className="appWrapper">
        <section className="appContent">
          <div
            style={{
              height: "calc(100vh - 150px)",
              padding: "40px 0px",
              width: "80%",
              display: "flex",
            }}
          >
            <div
              className="border-1 border-solid border-gray-300 rounded-l-2xl"
              style={{
                width: "100%",
                display: "flex",
                color: "white",
              }}
            >
              <div
                className="border-r-1 border-solid border-gray-300 overflow-y-auto"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  width: 400,
                }}
              >
                {scripts.map((item) => (
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 4,
                    }}
                    className="bg-gray-700 hover:bg-gray-800 cursor-pointer m-4 border-gray-300 border-solid border-1"
                    onClick={() => setSelectedScriptId(item.id)}
                  >
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#ccc" }}>
                      Updated at:{" "}
                      {new Date(item.updatedAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 w-full justify-center flex overflow-y-auto">
                {selectedScript && (
                  <div className="flex flex-col gap-8 w-1/2">
                    <div>
                      <TextField
                        label="Title"
                        value={selectedScript.title}
                        fullWidth
                        slotProps={{
                          htmlInput: {
                            readOnly: true,
                          },
                        }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Description"
                        value={selectedScript.description}
                        fullWidth
                        multiline
                        slotProps={{
                          htmlInput: {
                            readOnly: true,
                          },
                        }}
                      />
                    </div>
                    <div>
                      {selectedScript.blocks.map((block, index) => (
                        <div
                          key={index}
                          className="mb-8 border-l-1 border-solid border-gray-500 pl-4"
                        >
                          <TextField
                            label={`Block ${index + 1}`}
                            value={block.content}
                            fullWidth
                            multiline
                            minRows={3}
                            slotProps={{
                              htmlInput: {
                                readOnly: true,
                              },
                            }}
                          />
                          <Select
                            labelId="script-block-type-select-label"
                            value={selectedScript.blocks[index].type}
                            label={t("script.block.types.title")}
                            onChange={(e) =>
                              changeScriptBlockType(
                                block.id,
                                e.target.value as ScriptBlockType
                              )
                            }
                            fullWidth
                          >
                            {SCRIPT_BLOCK_TYPES.map((item) => (
                              <MenuItem key={item} value={item}>
                                {t(`script.block.types.${item}`)}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
