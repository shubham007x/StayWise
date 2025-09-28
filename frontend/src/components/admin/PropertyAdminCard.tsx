import { Property } from '@/types';
import Button from '@/components/ui/Button';
import { Home, Check, X, MapPin } from 'lucide-react';

interface PropertyAdminCardProps {
    property: Property;
    onUpdateProperty: (id: string, updates: { isApproved?: boolean; isActive?: boolean }) => void;
}

export default function PropertyAdminCard({ property, onUpdateProperty }: PropertyAdminCardProps) {
    const handleToggleApproved = () => {
        onUpdateProperty(property._id, { isApproved: !property.isApproved });
    };

    const handleToggleActive = () => {
        onUpdateProperty(property._id, { isActive: !property.isActive });
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 truncate max-w-xs">
                            {property.title}
                        </h3>
                        <p className="text-sm text-gray-600">{property.owner.firstName} {property.owner.lastName}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{property.location.city}, {property.location.country}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {property.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {property.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    <span>Price: ${property.price}/night</span>
                    <span className="ml-4">Capacity: {property.capacity} guests</span>
                    <span className="ml-4">Type: {property.type}</span>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant={property.isApproved ? 'outline' : 'primary'}
                        size="sm"
                        onClick={handleToggleApproved}
                        className="flex items-center space-x-1"
                    >
                        {property.isApproved ? (
                            <>
                                <X className="h-4 w-4" />
                                <span>Reject</span>
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Approve</span>
                            </>
                        )}
                    </Button>

                    <Button
                        variant={property.isActive ? 'outline' : 'primary'}
                        size="sm"
                        onClick={handleToggleActive}
                        className="flex items-center space-x-1"
                    >
                        {property.isActive ? (
                            <>
                                <X className="h-4 w-4" />
                                <span>Deactivate</span>
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Activate</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                Listed: {new Date(property.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}
