# ConfirmDialog

## Introduction

`ConfirmDialog` is a reusable, controlled confirmation modal. Use it for actions such as deleting records, signing out, or confirming a form.

This guide includes the component implementation and supported usage examples.


## Implement dialog

The component wraps alert-dialog primitives and a button component:

```tsx title="ConfirmDialog implementation"
import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  desc: React.JSX.Element | string
  disabled?: boolean
  cancelBtnText?: string
  confirmText?: React.ReactNode
  destructive?: boolean
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
} & (
  | { form: string; handleConfirm?: undefined }
  | { form?: undefined; handleConfirm: () => void }
)

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    form,
    handleConfirm,
    open,
    onOpenChange,
  } = props

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader className='text-start'>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {desc}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelBtnText ?? 'Cancel'}
          </AlertDialogCancel>
          <Button
            type={form ? 'submit' : 'button'}
            form={form}
            onClick={handleConfirm}
            variant={destructive ? 'destructive' : 'default'}
            disabled={disabled || isLoading}
          >
            {confirmText ?? 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

The component require callers to choose exactly one confirmation mechanism: a direct `handleConfirm` callback or a form ID.
- A form-based dialog submits the external form associated with its ID.
- A callback-based dialog calls the supplied handler directly.

## Props

| Prop | Required | Purpose |
| --- | --- | --- |
| `open` | Yes | Whether the dialog is shown. |
| `onOpenChange` | Yes | Receives the next open state when the user opens or closes the dialog. |
| `title` | Yes | Heading content; accepts any `React.ReactNode`, including JSX. |
| `desc` | Yes | Description content; accepts a string or `React.JSX.Element`. |
| `form` | One of `form` or `handleConfirm` | Form ID to submit when the Confirm button is clicked. |
| `handleConfirm` | One of `form` or `handleConfirm` | Callback invoked when the Confirm button is clicked. |
| `disabled` | No | Disables Confirm, such as until typed confirmation text matches. |
| `isLoading` | No | Disables both Cancel and Confirm and shows a spinner in the Confirm button while the caller's action is loading. |
| `destructive` | No | Uses the destructive style for risky or irreversible actions. |
| `confirmText` | No | Confirm button label. Defaults to `Continue`. |
| `cancelBtnText` | No | Cancel button label. Defaults to `Cancel`. |
| `className` | No | Additional dialog-content classes, often used to adjust its width. |
| `children` | No | Additional content rendered between the description and buttons. |


## Usage: with callback

Use the `handleConfirm` prop for actions that don't need a form, such as signing out or
deleting one selected record:

- Close the dialog when the action succeeds.
- Close it immediately if that is the desired behavior.

```tsx title="Task confirmation callback"
import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { useTasks } from './tasks-provider'

export function TasksDialogs() {
  const { open, setOpen, currentTask, setCurrentTask } = useTasks()
  return (
    <>
      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentTask && (
        <ConfirmDialog
          key='task-delete'
          destructive
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen('delete')
            setTimeout(() => {
              setCurrentTask(null)
            }, 500)
          }}
          handleConfirm={() => {
            setOpen(null)
            setTimeout(() => {
              setCurrentTask(null)
            }, 500)
            showSubmittedData(
              currentTask,
              'The following task has been deleted:'
            )
          }}
          className='max-w-md'
          title={`Delete this task: ${currentTask.id} ?`}
          desc='This action cannot be undone.'
          confirmText='Delete'
        >
          <div>
            You are about to delete a task with the ID{' '}
            <strong>{currentTask.id}</strong>.
          </div>
        </ConfirmDialog>
      )}
    </>
  )
}
```

## Usage: with form

Use the `form` prop when the user must complete a form before confirming, such as typing a username or confirmation word:

- Match the form's `id` to the value of the `form` prop.
- Handle submission on the form, prevent the browser's default navigation, and perform the action there.
- The Confirm button is outside the form, but its `form` attribute submits the matching form.

```tsx title="Typed confirmation example"
import { useState, type FormEvent } from 'react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type TypedDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  username: string
  onDelete: () => void
}

export function TypedDeleteDialog({
  open,
  onOpenChange,
  username,
  onDelete,
}: TypedDeleteDialogProps) {
  const [value, setValue] = useState('')
  const formId = 'typed-delete-form'
  const canConfirm = value.trim() === username

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canConfirm) return

    onDelete()
    onOpenChange(false)
    setValue('')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form={formId}
      disabled={!canConfirm}
      title={`Delete ${username}?`}
      desc='Type the username to confirm deletion.'
      destructive
      confirmText='Delete'
    >
      <form id={formId} onSubmit={handleSubmit} className='space-y-4'>
        <Label>
          Username
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
        </Label>
      </form>
    </ConfirmDialog>
  )
}
```

## Customize the dialog

### Destructive styling and button labels

For risky actions:

- Set `destructive` to use the destructive button style.
- Supply labels suited to the action.
- Without `destructive`, Confirm uses the default button style.

```tsx title="Custom labels example"
<ConfirmDialog
  open={open}
  onOpenChange={onOpenChange}
  title='Sign out?'
  desc='You will need to sign in again to access your account.'
  destructive
  confirmText='Sign out'
  cancelBtnText='Stay signed in'
  handleConfirm={handleSignOut}
/>
```

### Disable confirmation until valid

Pass a boolean to `disabled` when the user must satisfy a condition first.
In the typed confirmation example, Confirm stays disabled until the input matches the username.

### Show a loading state

While the caller's action is running:

- Pass `isLoading` to disable Cancel and Confirm and show a spinner in the Confirm button.
- Manage asynchronous work, loading state, and error handling in the caller.

```tsx title="Loading state example"
<ConfirmDialog
  open={open}
  onOpenChange={onOpenChange}
  title='Save changes?'
  desc='Your changes will be applied.'
  isLoading={isSaving}
  confirmText={isSaving ? 'Saving...' : 'Save'}
  handleConfirm={handleSave}
/>
```
