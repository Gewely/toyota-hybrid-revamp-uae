
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const MobileDialog = DialogPrimitive.Root
const MobileDialogTrigger = DialogPrimitive.Trigger
const MobileDialogClose = DialogPrimitive.Close

const MobileDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
MobileDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const MobileDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <MobileDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-[101] bg-background overflow-hidden",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "mobile-viewport flex flex-col",
        className
      )}
      {...props}
      style={{
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        maxHeight: 'none',
        transform: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        margin: 0,
        border: 0,
        borderRadius: 0,
      }}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
MobileDialogContent.displayName = DialogPrimitive.Content.displayName

export {
  MobileDialog,
  MobileDialogTrigger,
  MobileDialogContent,
  MobileDialogClose,
  MobileDialogOverlay,
}
