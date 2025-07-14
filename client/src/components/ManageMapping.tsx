import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Trash2} from "lucide-react";

export function ManageMappings() {
  const mockMappings = [
    {id: 1, walletAddress: "0x1234...5678", socialAccount: "twitter:@user1"},
    {id: 2, walletAddress: "0xabcd...efgh", socialAccount: "instagram:@user2"},
  ];

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-teal-700">Wallet Address</TableHead>
            <TableHead className="text-teal-700">Social Account</TableHead>
            <TableHead className="text-teal-700">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockMappings.map((mapping) => (
            <TableRow key={mapping.id} className="border-b border-teal-200">
              <TableCell className="text-teal-800">
                {mapping.walletAddress}
              </TableCell>
              <TableCell className="text-teal-800">
                {mapping.socialAccount}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  className="bg-red-400 hover:bg-red-500 focus:ring-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
