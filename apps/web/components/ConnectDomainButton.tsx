
import { Button } from './ui/button'
import Link from 'next/link'
export default function ConnectDomainButton() {
    return (
      <Button className="px-6 py-3 text-sm">
        <Link href="/dashboard/domain">Connect Domain</Link>
      </Button>
    )
  }