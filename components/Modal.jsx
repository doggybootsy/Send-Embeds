import React, { memo, useState } from "react"
import { getModule, getModuleByDisplayName, constants, channels } from "@vizality/webpack"
import { Button, ColorPicker } from "@vizality/components"
import { TextInput, TextArea, Category } from "@vizality/components/settings"
import { _int2hex } from "@vizality/util/color"

const FormTitle = getModuleByDisplayName("FormTitle")
const { ModalRoot, ModalSize, ModalHeader, ModalContent, ModalFooter } = getModule("ModalRoot")

const { defaultMarginh5, h5 } = getModule("defaultMarginh5")

const queue = getModule(m => m?.default?.enqueue).default
const { createBotMessage } = getModule(["createBotMessage"])

export default memo((MProps) => {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [timestamp, setTimestamp] = useState("")
  const [color, setColor] = useState("default")
  const [author_Name, setAuthor_Name] = useState("")
  const [author_Url, setAuthor_Url] = useState("")
  const [author_Icon_Url, setAuthor_Icon_Url] = useState("")
  const [footer_Text, setFooter_Text] = useState("")
  const [footer_Icon_Url, setFooter_Icon_Url] = useState("")
  function setValue(func, value) {
    if ((title.length + description.length + author_Name.length + footer_Text.length) <= 6000) func(value)
  }
  return (
    <ModalRoot 
      {...MProps}
      size={ModalSize.LARGE}
      className="xLarge"
    >
      <ModalHeader separator={false}>
        <FormTitle tag="h4">Customize Embed</FormTitle>
      </ModalHeader>
      <ModalContent>
        <TextArea 
          maxLength={2000}
          value={content}
          onChange={(val) => setContent(val)}
        >Message</TextArea>
        <TextInput 
          value={title}
          onChange={(val) => setValue(setTitle, val)}
        >Title</TextInput>
        <TextArea
          maxLength={4096}
          value={description}
          onChange={(val) => setValue(setDescription, val)}
        >Description</TextArea>
        <TextInput 
          value={url}
          onChange={(val) => setUrl(val)}
        >Url</TextInput>
        <TextInput 
          value={url}
          onChange={(val) => setUrl(val)}
        >Url</TextInput>
        <TextInput 
          note="Must be in a format where 'new Date(<Your Timestamp>)' gives a valid timestamp"
          value={timestamp}
          onChange={(val) => setTimestamp((new Date(val)).toISOString())}
        >Timestamp</TextInput>
        <h5 className={[defaultMarginh5, h5].join(" ")}>Color</h5>
        <ColorPicker 
          onChange={(val) => setColor(val)}
          value={color === "default" ? document.documentElement.classList.contains("theme-dark") ? 2105893 : 14935528 : color}
          defaultColor={document.documentElement.classList.contains("theme-dark") ? 2105893 : 14935528}
          colors={constants.ROLE_COLORS}
        ></ColorPicker>
        <div style={{height: 20}} />
        <Category title="Author">
          <TextInput 
            value={author_Name}
            onChange={(val) => setValue(setAuthor_Name, val.substring(0, 256))}
          >Name</TextInput>
          <TextInput 
            value={author_Url}
            onChange={(val) => setAuthor_Url(val)}
          >Url</TextInput>
          <TextInput 
            value={author_Icon_Url}
            onChange={(val) => setAuthor_Icon_Url(val)}
          >Icon Url</TextInput>
        </Category>
        <Category title="Footer">
          <TextInput 
            value={footer_Text}
            onChange={(val) => setFooter_Text(val.substring(0, 2014))}
          >Text</TextInput>
          <TextInput 
            value={footer_Icon_Url}
            onChange={(val) => setFooter_Icon_Url(val)}
          >Icon Url</TextInput>
        </Category>
      </ModalContent>
      <ModalFooter>
        <Button
          onClick={() => {
            const channelId = channels.getChannelId()
            const { id:nonce } = createBotMessage(channelId, "")
            function getVal(val) {
              if (val === "") return null
              return val
            }
            queue.enqueue({
              type: 0,
              message: {
                channelId, nonce, tts: false, content,
                embed: {
                  type: "rich",
                  title: getVal(title),
                  author: {
                    name: getVal(author_Name),
                    url: getVal(author_Url),
                    icon_url: getVal(author_Icon_Url)
                  },
                  footer: {
                    text: getVal(footer_Text),
                    icon_url: getVal(footer_Icon_Url)
                  },
                  description: getVal(description),
                  url: getVal(url),
                  timestamp: getVal(timestamp),
                  color: color === "default" ? (document.documentElement.classList.contains("theme-dark") ? 2105893 : 14935528) : color,
                }
              }
            }, () => { return })
            MProps.onClose()
          }}
          disabled={!(title.length + author_Name.length + author_Url.length + author_Icon_Url.length + footer_Text.length + footer_Icon_Url.length + description.length + url.length + timestamp.length)}
        >Send</Button>
        <div style={{width: 10}}/>
        <Button
          color={Button.Colors.TRANSPARENT}
          onClick={MProps.onClose}
        >Cancel</Button>
      </ModalFooter>
    </ModalRoot>
  )
})