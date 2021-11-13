import React, { memo } from "react"
import Modal from "./Modal"
import { joinClassNames } from "@vizality/util/dom"
import { Icon } from "@vizality/components"
import { openModal } from "@vizality/modal"
import { getModule, getModuleByPrototypes, getModuleByDisplayName } from "@vizality/webpack"

const Clickable = getModuleByDisplayName("Clickable")
const Tooltip = getModuleByPrototypes(["renderTooltip"])
const { clickable, iconWrapper, icon } = getModule("iconWrapper", "clickable")
const { Divider } = getModule("Divider", "Icon")

export default memo(({  }) => {
  return (
    <>
      <Tooltip text="Send Embed">
        {TtProps => (
          <Clickable 
            {...TtProps}
            onClick={(args) => {
              TtProps.onClick(args)
              openModal(MProps => <Modal {...MProps} />)
            }}
            className={joinClassNames(clickable, iconWrapper)}
            role="button"
            tag="div"
          >
            <Icon name="InlineCode" className={icon} />
          </Clickable>
        )}
      </Tooltip>
      <Divider />
    </>
  )
})