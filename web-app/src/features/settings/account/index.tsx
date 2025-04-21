import ContentSection from '../components/content-section.tsx'
import { AccountForm } from './account-form.tsx'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Account'
      desc='Update your account settings. Set your preferred language and
          timezone.'
    >
      <AccountForm />
    </ContentSection>
  )
}
