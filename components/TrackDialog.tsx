import React from 'react'
import * as dialog from '@/components/ui/dialog'

interface TrackDialogProps {
  open: boolean,
  setOpen: (isOpen: boolean) => void;
  trackId: number
}

const TrackDialog: React.FC<TrackDialogProps> = ({ open, setOpen, trackId }) => {
  return (
    <dialog.Dialog open={open} onOpenChange={setOpen} >
      <dialog.DialogTrigger  >
        <span className='hidden' ></span>
      </dialog.DialogTrigger>
      {/* content */}
      <dialog.DialogContent>
        {/* header */}
        <dialog.DialogHeader>
          <dialog.DialogTitle>
            title
          </dialog.DialogTitle>
          <dialog.DialogDescription>
            description
          </dialog.DialogDescription>
        </dialog.DialogHeader>
        <div>
          {trackId}
        </div>
        {/* footer */}
        <dialog.DialogFooter>
          <dialog.DialogClose>
            {/* <Button type='button' variant={"secondary"} > */}
            {/*   close */}
            {/* </Button> */}
          </dialog.DialogClose>
        </dialog.DialogFooter>
      </dialog.DialogContent>
    </dialog.Dialog>
  )
}

export default TrackDialog
