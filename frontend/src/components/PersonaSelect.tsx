
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Option = {
  value: string
  label: string
  colorClass: string 
}

type PersonaSelectProps = {
  value: string
  onChange: (value: string) => void
}

const options: Option[] = [
  { value: 'chillFriend',    label: 'Chill Friend',     colorClass: 'bg-vibeSky'   },
  { value: 'gentleListener', label: 'Gentle Listener',  colorClass: 'bg-vibeMint'  },
  { value: 'harshCoach',     label: 'Harsh Coach',      colorClass: 'bg-vibeCoral' },
]

const PersonaSelect = ({ value, onChange }: PersonaSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-12 font-bold focus:ring-0 focus:ring-offset-0 border-2 border-border rounded-md bg-card">
        <SelectValue placeholder="Select a persona" />
      </SelectTrigger>
      <SelectContent className="border-2 border-border rounded-md shadow-md bg-card">
        {options.map((opt) => (
          <SelectItem 
            key={opt.value} 
            value={opt.value}
            className="font-bold cursor-pointer focus:bg-accent focus:text-accent-foreground py-3"
          >
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full border border-border ${opt.colorClass}`} />
              {opt.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PersonaSelect
