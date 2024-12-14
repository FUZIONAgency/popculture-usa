import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/player";

interface ProfileCardProps {
  profile: Profile | null;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="font-medium">Email</label>
            <p className="text-gray-600">{profile?.email || 'No email set'}</p>
          </div>
          <div>
            <label className="font-medium">Username</label>
            <p className="text-gray-600">{profile?.username || 'Not set'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};