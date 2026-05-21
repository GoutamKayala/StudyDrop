import React from 'react';

const branches = ['CSE', 'CSD', 'ECE', 'EEE', 'MECH', 'CSM', 'IT', 'CIVIL', 'CHEMICAL'];

const Sidebar = ({ isOpen, selectedBranch, setSelectedBranch }) => {
    return (
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-16`}>
            <div className="h-full overflow-y-auto p-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Branches</h2>
                <div className="space-y-1">
                    <button
                        onClick={() => setSelectedBranch(null)}
                        className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${!selectedBranch ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        All Branches
                    </button>
                    {branches.map(branch => (
                        <button
                            key={branch}
                            onClick={() => setSelectedBranch(branch)}
                            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedBranch === branch ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            {branch}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
