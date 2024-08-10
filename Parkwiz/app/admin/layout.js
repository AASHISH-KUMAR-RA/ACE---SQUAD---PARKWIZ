import { DataProvider } from '../context/DataContext';
import DashboardHeader from "../../components/dashboardheader"
export default function RootLayout({children}){
    return(
        <DataProvider>
            <div className='b'>
            <DashboardHeader/>

        {children}
        </div>
        </DataProvider>
    )
}