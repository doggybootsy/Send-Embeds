import { Plugin } from "@vizality/entities"
import { patch } from "@vizality/patcher"
import { getModuleByDisplayName, getModule } from "@vizality/webpack"
import React from "react"
import ToolbarIcon from "./components/ToolbarIcon"
const HeaderBarContainer = getModuleByDisplayName("HeaderBarContainer")?.prototype

export default class sendEmbeds extends Plugin {
  start () {
    patch("Test", HeaderBarContainer, "renderLoggedIn", (_, __, {props: {toolbar}}) => {
      if (!toolbar?.unshift) return;
      else toolbar.unshift(<ToolbarIcon />)
    })
    this.injectStyles("./components/Style.scss")
    if (!this.settings.get("showedAlert", false)) {
      vizality.api.notifications.sendNotice({
        message: "Using sendEmbeds can get your account banned!",
        color: "BLURPLE_GRADIENT_2"
      })
      this.settings.toggle("showedAlert", false)
    }
  }
  stop () {}
}