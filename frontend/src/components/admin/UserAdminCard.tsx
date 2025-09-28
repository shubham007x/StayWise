import { User } from '@/types';
import Button from '@/components/ui/Button';
import { UserCheck, UserX, Crown, User as UserIcon } from 'lucide-react';

interface UserAdminCardProps {
    user: User;
    onUpdateUser: (id: string, updates: { role?: string; isActive?: boolean }) => void;
}

export default function UserAdminCard({ user, onUpdateUser }: UserAdminCardProps) {
    const handleRoleChange = () => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        onUpdateUser(user.id, { role: newRole });
    };

    const handleToggleActive = () => {
        onUpdateUser(user.id, { isActive: !user.isActive });
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        {user.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Joined: {new Date(user.createdAt || '').toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRoleChange}
                        className="flex items-center space-x-1"
                    >
                        {user.role === 'admin' ? (
                            <>
                                <UserX className="h-4 w-4" />
                                <span>Remove Admin</span>
                            </>
                        ) : (
                            <>
                                <Crown className="h-4 w-4" />
                                <span>Make Admin</span>
                            </>
                        )}
                    </Button>

                    <Button
                        variant={user.isActive ? 'outline' : 'primary'}
                        size="sm"
                        onClick={handleToggleActive}
                        className="flex items-center space-x-1"
                    >
                        {user.isActive ? (
                            <>
                                <UserX className="h-4 w-4" />
                                <span>Deactivate</span>
                            </>
                        ) : (
                            <>
                                <UserCheck className="h-4 w-4" />
                                <span>Activate</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
