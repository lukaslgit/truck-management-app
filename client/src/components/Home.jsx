import { UserIcon } from '@heroicons/react/24/outline'

export default function(){
    
    return(
        <>
            <div className="w-2xl pb-10">
                <h1 className="font-bold text-4xl pb-4">Truck Manager App (WIP)</h1>
                <p className="pb-1">This web app is a role-based web application designed to streamline fleet and workforce management within a transportation or logistics company.</p>
                <p>The system provides tools for managing trucks, tasks, and workers through a clear and structured interface.</p>
            </div>

            <div className="w-2xl pb-10">
                <h2 className="text-2xl font-bold pb-2 flex items-center">
                    <UserIcon className="h-8 w-8 mr-2 -mt-1" />
                    User Roles
                </h2>
                <div>
                    <p className="font-bold text-xl">Manager</p>
                    <p className="pb-1">Managers have full administrative access and can:</p>
                    <ul className="pl-4 list-disc">
                        <li>
                            View and manage all trucks
                        </li>
                        <li>
                            Register new trucks
                        </li>
                        <li>
                            View detailed truck information
                        </li>
                        <li>
                            Create and manage tasks
                        </li>
                        <li>
                            Assign and monitor tasks
                        </li>
                        <li>
                            Manage workers
                        </li>
                        <li>
                            View detailed worker profiles
                        </li>
                    </ul>

                    <p className="pt-5 font-bold text-xl">Worker</p>
                    <p className="pb-1">Workers can:</p>
                    <ul className="pl-4 list-disc">
                        <li>
                            Access their profile
                        </li>
                        <li>
                            View assigned tasks
                        </li>
                        <li>
                            View task details
                        </li>
                    </ul>
                </div>
            </div>

            <div className="w-2xl pb-10">
                <h2 className="font-bold text-xl">Truck Management</h2>
                <p className="pb-1">Managers can:</p>
                <ul className="pl-4 list-disc">
                    <li>
                        View a list of all registered trucks
                    </li>
                    <li>
                        Add new trucks to the system
                    </li>
                    <li>
                        View detailed information about each truck
                    </li>
                </ul>
            </div>

            <div className="w-2xl pb-10">
                <h2 className="font-bold text-xl">Task Management</h2>
                <p className="pb-1">The system allows managers to:</p>
                <ul className="pl-4 list-disc">
                    <li>
                        Chat with the worker asigned to the task
                    </li>
                    <li>
                        Create new tasks
                    </li>
                    <li>
                        View all tasks
                    </li>
                    <li>
                        View detailed task information
                    </li>
                    <li>
                        Assign tasks to workers
                    </li>
                </ul>
                <p className="pt-2">Workers can view tasks assigned to them.</p>
            </div>
        </>
    )
}