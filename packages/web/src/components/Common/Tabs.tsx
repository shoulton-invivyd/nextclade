import React, { ReactNode, useCallback, useState } from 'react'

import type { StrictOmit } from 'ts-essentials'
import { Nav as NavBase, NavItem, NavItemProps, NavLink, NavProps, TabContent, TabPane } from 'reactstrap'
import styled from 'styled-components'

const TabsContainer = styled.section``

const Nav = styled(NavBase)`
  cursor: pointer;
`

export interface TabDesc {
  name: string
  title: ReactNode
  body?: ReactNode
}

export interface TabsProps {
  tabs: TabDesc[]
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>('file')

  return (
    <TabsContainer>
      <TabsPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <TabsContent tabs={tabs} activeTab={activeTab} />
    </TabsContainer>
  )
}

export interface TabComponentProps extends StrictOmit<NavItemProps, 'onChange'> {
  tab: TabDesc
  activeTab: string
  onChange(tabName: string): void
}

export function TabComponent({ tab, activeTab, onChange }: TabComponentProps) {
  const onClick = useCallback(() => {
    if (activeTab !== tab.name) {
      onChange(tab.name)
    }
  }, [activeTab, onChange, tab.name])

  return (
    <NavItem>
      <NavLink active={activeTab === tab.name} onClick={onClick}>
        {tab.title}
      </NavLink>
    </NavItem>
  )
}

export interface TabsPanelProps extends StrictOmit<NavProps, 'tabs'> {
  tabs: TabDesc[]
  activeTab: string
  onChange(tabName: string): void
}

export function TabsPanel({ tabs, activeTab, onChange, ...restProps }: TabsPanelProps) {
  return (
    <Nav tabs {...restProps}>
      {tabs.map((tab, i) => (
        <TabComponent key={tab.name} tab={tab} activeTab={activeTab} onChange={onChange} />
      ))}
    </Nav>
  )
}

export interface TabsContentProps {
  tabs: TabDesc[]
  activeTab: string
}

export function TabsContent({ tabs, activeTab }: TabsContentProps) {
  return (
    <TabContent activeTab={activeTab}>
      {tabs.map((tab, i) => (
        <TabPane tabId={tab.name} key={tab.name}>
          {tab.body}
        </TabPane>
      ))}
    </TabContent>
  )
}
