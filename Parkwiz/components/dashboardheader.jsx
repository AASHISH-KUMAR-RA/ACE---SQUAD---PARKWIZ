"use client"
import { Tab, Tabs } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const DashboardHeader = () => {
    const pathname = usePathname();
  return (
    
    <div className='sheader'><Tabs  size='lg' aria-label="Tabs sizes" selectedKey={pathname}>
    <Tab key="Statistics" title="Statistics" href="/admin/dashboard"/>
    <Tab key="Users" title="Users" href="/admin/users"/>
    <Tab key="Orders" title="Orders" href="/admin/orders"/>
  </Tabs></div>
  )
}

export default DashboardHeader