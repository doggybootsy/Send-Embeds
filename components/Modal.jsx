import React from "react"
import { getModule, getModuleByDisplayName, constants, channels } from "@vizality/webpack"
import { Button, ColorPicker } from "@vizality/components"
import { TextInput, TextArea, Category, SwitchItem } from "@vizality/components/settings"
import { _int2hex } from "@vizality/util/color"

const premiumOrNah = getModule(m => m?.default?.canUseIncreasedMessageLength).default?.canUseIncreasedMessageLength(getModule("getCurrentUser").getCurrentUser())
const FormTitle = getModuleByDisplayName("FormTitle")
const { ModalRoot, ModalSize, ModalHeader, ModalContent, ModalFooter } = getModule("ModalRoot")

const { defaultMarginh5, h5 } = getModule("defaultMarginh5")

const queue = getModule(m => m?.default?.enqueue).default
const { createBotMessage } = getModule(["createBotMessage"])
export default class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: "",
      title: "",
      description: "",
      url: "",
      timestamp: "",
      color: "default",
      author: {
        name: "",
        url: "",
        icon: "",
      },
      footer: {
        text: "",
        icon: "",
      },
      FieldStates: {},
      hash: 1
    }
    const modalThis = this
    this.Field = class extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          name: "",
          value: "",
          inline: false
        }
        this.num = Boolean(Object.keys(modalThis.state.FieldStates).length) ? Object.keys(modalThis.state.FieldStates).length : 0
      }
      render() {
        modalThis.state.FieldStates[this.num] = (this.state)
        return (
          <div className="DE-Field">
            <TextInput 
              value={this.state.name}
              onChange={(name) => {
                this.setState({ name })
                modalThis.setState({ hash: modalThis.state.hash + 1 })
              }}
            >Name</TextInput>
            <SwitchItem
              value={this.state.inline}
              onChange={(inline) => this.setState({ inline })}
            >Inline</SwitchItem>
            <TextArea 
              value={this.state.value}
              onChange={(value) => {
                this.setState({ value })
                modalThis.setState({ hash: modalThis.state.hash + 1 })
              }}
            >Value</TextArea>
          </div>
        )
      }
    }
  }
  render() {
    const {
      content,
      title,
      description,
      url,
      timestamp,
      author,
      footer,
      color,
      FieldStates
    } = this.state
    window["this.state"] = this.state
    return (
      <ModalRoot 
        {...this.props}
        size={ModalSize.LARGE}
        className="DE-Modal"
      >
        <ModalHeader separator={false}>
          <FormTitle tag="h4">Customize Embed</FormTitle>
        </ModalHeader>
        <ModalContent>
          <TextArea 
            maxLength={premiumOrNah ? 4000 : 2000}
            value={content}
            onChange={(content) => this.setState({ content })}
          >Message</TextArea>
          <TextInput 
            value={title}
            onChange={(title) => this.setState({ title })}
          >Title</TextInput>
          <TextArea
            maxLength={4096}
            value={description}
            onChange={(description) => this.setState({ description })}
          >Description</TextArea>
          <TextInput 
            value={url}
            onChange={(url) => this.setState({ url })}
          >Url</TextInput>
          <TextInput 
            note="Must be in a format where 'new Date(<Your Timestamp>)' gives a valid timestamp"
            value={timestamp}
            onChange={(timestamp) => this.setState({ timestamp })}
          >Timestamp</TextInput>
          <h5 className={[defaultMarginh5, h5].join(" ")}>Color</h5>
          <ColorPicker 
            onChange={(color) => this.setState({ color})}
            value={color === "default" ? document.documentElement.classList.contains("theme-dark") ? 2105893 : 14935528 : color}
            defaultColor={document.documentElement.classList.contains("theme-dark") ? 2105893 : 14935528}
            colors={constants.ROLE_COLORS}
          ></ColorPicker>
          <div style={{height: 20}} />
          <Category title="Fields">
            <this.Field /> <this.Field /> <this.Field /> <this.Field /> 
          </Category>
          <Category title="Author">
            <TextInput 
              value={author.name}
              onChange={(val) => {
                author.name = val
                this.setState({ author })
              }}
            >Name</TextInput>
            <TextInput 
              value={author.url}
              onChange={(val) => {
                author.url = val
                this.setState({ author })
              }}
            >Url</TextInput>
            <TextInput 
              value={author.icon}
              onChange={(val) => {
                author.icon = val
                this.setState({ author })
              }}
            >Icon Url</TextInput>
          </Category>
          <Category title="Footer">
            <TextInput 
              value={footer.text}
              onChange={(val) => {
                footer.text = val.substring(0, 2014)
                this.setState({ footer })
              }}
            >Text</TextInput>
            <TextInput 
              value={footer.icon}
              onChange={(val) => {
                footer.icon = val.substring(0, 2014)
                this.setState({ footer })
              }}
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
              let fields = []
              Object.keys(FieldStates).forEach(key => {
                if (FieldStates[key].name === "" &&   FieldStates[key].value === "") return
                fields.push({
                  name: FieldStates[key].name,
                  value: FieldStates[key].value,
                  inline: FieldStates[key].inline
                })
              })
              queue.enqueue({
                type: 0,
                message: {
                  channelId, nonce, tts: false, content,
                  embed: {
                    type: "rich",
                    title: getVal(title),
                    author: {
                      name: getVal(author.name),
                      url: getVal(author.url),
                      icon_url: getVal(author.icon)
                    },
                    footer: {
                      text: getVal(footer.text),
                      icon_url: getVal(footer.icon)
                    },
                    description: getVal(description),
                    url: getVal(url),
                    fields,
                    timestamp: timestamp === "" ? null : (new Date(timestamp)).toISOString(),
                    color: color === "default" ? (document.documentElement.classList.contains("theme-dark") ? 2105893 : 14935528) : color,
                  }
                }
              }, () => { return })
              this.props.onClose()
            }}
          >Send</Button>
          <div style={{width: 10}}/>
          <Button
            color={Button.Colors.TRANSPARENT}
            onClick={this.props.onClose}
          >Cancel</Button>
        </ModalFooter>
      </ModalRoot>
    )
  }
}