"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType } from "react";

// Loading spinning icon
import LoaderIcon from "@/app/blocks/loading/Loader";

// Context 
import { useUser } from "@/context/User.context";

// Countries/Locations
import  DropdownMenuCheckboxes  from "@/app/blocks/CountrySelector";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import {
  Camera,
  Image as ImageIcon,
  X, 
  // MapPin,
} from "lucide-react";


import { 
    FaLinkedinIn as Linkedin, 
    FaInstagram as Instagram, 
    FaFacebookF as Facebook, 
    FaDiscord as Discord,
    FaYoutube as Youtube  
} from "react-icons/fa";
import { FiGithub as Github } from "react-icons/fi";
import { FaXTwitter as Twitter } from "react-icons/fa6";

/* =========================================================
   TYPES
========================================================= */

type SocialKey =
  | "linkedin"
  | "github"
  | "x"
  | "facebook"
  | "instagram"
  | "youtube"
  | "discord";

type Social = {
  label: string;
  icon: ElementType;
  url: string;
  visible: boolean;
};

type Workspace = {
  _id: string;

  name: string;

  logo?: string;
  logoPublicId?: string;

  banner?: string;
  bannerPublicId?: string;

  about?: string;
  location?: string;

  founded?: string | Date | null;

  slug: string;

  socials?: {
    linkedin?: {
      url: string;
      visible: boolean;
    };

    github?: {
      url: string;
      visible: boolean;
    };

    x?: {
      url: string;
      visible: boolean;
    };

    facebook?: {
      url: string;
      visible: boolean;
    };

    instagram?: {
      url: string;
      visible: boolean;
    };

    youtube?: {
      url: string;
      visible: boolean;
    };

    discord?: {
      url: string;
      visible: boolean;
    };
  };
};

interface EditWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // workspace: Workspace;
  ActiveWorkspace: Workspace;

  onSave?: (formData: FormData) => Promise<void>;
}

/* =========================================================
   SOCIAL CONFIG
========================================================= */

const SOCIAL_CONFIG: Record<
  SocialKey,
  {
    label: string;
    icon: ElementType;
    visible: boolean;
  }
> = {
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    visible: false,
  },

  github: {
    label: "GitHub",
    icon: Github,
    visible: false,
  },

  x: {
    label: "X / Twitter",
    icon: Twitter,
    visible: false,
  },

  facebook: {
    label: "Facebook",
    icon: Facebook,
    visible: false,
  },

  instagram: {
    label: "Instagram",
    icon: Instagram,
    visible: false,
  },

  youtube: {
    label: "YouTube",
    icon: Youtube,
    visible: false,
  },

  discord: {
    label: "Discord",
    icon: Discord,
    visible: false,
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function EditWorkspaceDialog({
  open,
  onOpenChange,
  ActiveWorkspace,
  // workspace,
  onSave,
}: EditWorkspaceDialogProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);


      // User Context
      const { 
        updateWorkspaceLoading,
        updateWorkspace,
      } = useUser();

  /* ---------------------------------------------------------
     Basic information
  --------------------------------------------------------- */

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [founded, setFounded] = useState<Date | undefined>();

  /* ---------------------------------------------------------
     Images
  --------------------------------------------------------- */

  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);

  /* ---------------------------------------------------------
     Socials
  --------------------------------------------------------- */

  const [socials, setSocials] = useState<
    Record<SocialKey, Social>
  >({
    linkedin: {
      ...SOCIAL_CONFIG.linkedin,
      url: "",
      // visible: false,
      visible: SOCIAL_CONFIG.linkedin.visible,
    },

    github: {
      ...SOCIAL_CONFIG.github,
      url: "",
      visible: SOCIAL_CONFIG.github.visible,
    },

    x: {
      ...SOCIAL_CONFIG.x,
      url: "",
      visible: SOCIAL_CONFIG.x.visible,
    },

    facebook: {
      ...SOCIAL_CONFIG.facebook,
      url: "",
      visible: SOCIAL_CONFIG.facebook.visible,
    },

    instagram: {
      ...SOCIAL_CONFIG.instagram,
      url: "",
      visible: SOCIAL_CONFIG.instagram.visible,
    },

    youtube: {
      ...SOCIAL_CONFIG.youtube,
      url: "",
      visible: SOCIAL_CONFIG.youtube.visible,
    },

    discord: {
      ...SOCIAL_CONFIG.discord,
      url: "",
      visible: SOCIAL_CONFIG.discord.visible,
    },
  });

  const [saving, setSaving] = useState(false);

  /* =========================================================
     LOAD WORKSPACE INTO FORM
  ========================================================= */

  useEffect(() => {
    if (!ActiveWorkspace) return;

    setName(ActiveWorkspace.name || "");
    setLocation(ActiveWorkspace.location || "");
    setAbout(ActiveWorkspace.about || "");

    setFounded(
      ActiveWorkspace.founded
        ? new Date(ActiveWorkspace.founded)
        : undefined
    );

    setLogo(null);
    setBanner(null);

    setRemoveLogo(false);
    setRemoveBanner(false);

    setLogoPreview(ActiveWorkspace.logo || "");
    setBannerPreview(ActiveWorkspace.banner || "");

    /*
     * Convert workspace.socials into local form state.
     */
    setSocials({
      linkedin: {
        ...SOCIAL_CONFIG.linkedin,
        url: ActiveWorkspace.socials?.linkedin?.url || "",
        visible: ActiveWorkspace.socials?.linkedin?.visible ?? false,
      },

      github: {
        ...SOCIAL_CONFIG.github,
        url: ActiveWorkspace.socials?.github?.url || "",
        visible: ActiveWorkspace.socials?.github?.visible ?? false,
      },

      x: {
        ...SOCIAL_CONFIG.x,
        url: ActiveWorkspace.socials?.x?.url || "",
        visible: ActiveWorkspace.socials?.x?.visible ?? false,
      },

      facebook: {
        ...SOCIAL_CONFIG.facebook,
        url: ActiveWorkspace.socials?.facebook?.url || "",
        visible: ActiveWorkspace.socials?.facebook?.visible ?? false,
      },

      instagram: {
        ...SOCIAL_CONFIG.instagram,
        url: ActiveWorkspace.socials?.instagram?.url || "",
        visible:
          ActiveWorkspace.socials?.instagram?.visible ?? false,
      },

      youtube: {
        ...SOCIAL_CONFIG.youtube,
        url: ActiveWorkspace.socials?.youtube?.url || "",
        visible:
          ActiveWorkspace.socials?.youtube?.visible ?? false,
      },

      discord: {
        ...SOCIAL_CONFIG.discord,
        url: ActiveWorkspace.socials?.discord?.url || "",
        visible:
          ActiveWorkspace.socials?.discord?.visible ?? false,
      },
    });
  }, [ActiveWorkspace]);

  /* =========================================================
     IMAGE HANDLERS
  ========================================================= */

  const handleLogoChange = (file?: File) => {
    if (!file) return;

    setLogo(file);
    setRemoveLogo(false);

    const preview = URL.createObjectURL(file);

    setLogoPreview(preview);
  };

  const handleBannerChange = (file?: File) => {
    if (!file) return;

    setBanner(file);
    setRemoveBanner(false);

  const preview = URL.createObjectURL(file);
    setBannerPreview(preview);
  };


  const removeLogoImage = () => {
    setLogo(null);
    setLogoPreview("");
    setRemoveLogo(true);
  };

  const removeBannerImage = () => {
    setBanner(null);
    setBannerPreview("");
    setRemoveBanner(true);
  };

  /* =========================================================
     SOCIAL HANDLERS
  ========================================================= */

  const updateSocialUrl = (
    key: SocialKey,
    value: string
  ) => {
    setSocials((prev) => ({
      ...prev,

      [key]: {
        ...prev[key],
        url: value,
      },
    }));
  };

  const updateSocialVisibility = (
    key: SocialKey,
    visible: boolean
  ) => {
    setSocials((prev) => ({
      ...prev,

      [key]: {
        ...prev[key],
        visible,
      },
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("location", location.trim());
      formData.append("about", about.trim());


      if (founded) {
        formData.append("founded",founded.toISOString());
      } else {
        formData.append("founded", "");
      }

      /* Images */

      if (logo) {
        formData.append("logo", logo);
      }

      if (banner) {
        formData.append("banner", banner);
      }

      formData.append("removeLogo", String(removeLogo));

      formData.append("removeBanner", String(removeBanner));

      /*
       * Send socials as JSON.
       *
       * This matches the MongoDB structure:
       *
       * socials: {
       *   linkedin: {
       *     url: "...",
       *     visible: true
       *   }
       * }
       */

      const socialsData = Object.fromEntries(
        Object.entries(socials).map(
          ([key, social]) => [
            key,
            {
              url: social.url.trim(),
              visible: social.visible,
            },
          ]
        )
      );

      formData.append(
        "socials",
        JSON.stringify(socialsData)
      );

      await updateWorkspace(formData);

      if (onSave) {
        await onSave(formData);
      }

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to update workspace:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          w-[calc(100%-20rem)] 
          max-w-none!
          overflow-y-auto
          p-4
          gap-0
          max-h-[90vh]
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <DialogHeader
          className="
            border-b
            px-6
            py-5
          "
        >
          <DialogTitle className="text-base font-semibold">
            Edit Workspace
          </DialogTitle>
        </DialogHeader>

        {/* =====================================================
            SCROLLABLE CONTENT
        ===================================================== */}

        <div className="overflow-y-auto">
          {/* ===================================================
              BANNER
          ==================================================== */}

          <div className="relative h-52">
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Workspace banner"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-r
                  from-orange-400
                  via-pink-500
                  to-purple-600
                "
              />
            )}

            {/* Dark overlay */}

            <div className="absolute inset-0 bg-black/10" />

            {/* Banner controls */}

            <div
              className="
                absolute
                right-4
                top-4
                flex
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  bannerInputRef.current?.click()
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-black/50
                  text-white
                  backdrop-blur
                  transition
                  hover:bg-black/70
                "
              >
                <ImageIcon size={18} />
              </button>

              {bannerPreview && (
                <button
                  type="button"
                  onClick={removeBannerImage}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-black/50
                    text-white
                    backdrop-blur
                    transition
                    hover:bg-black/70
                  "
                >
                  <X  size={18} />
                </button>
              )}
            </div>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                handleBannerChange(
                  event.target.files?.[0]
                )
              }
            />

            {/* =================================================
                WORKSPACE LOGO
            ================================================== */}

            <div
              className="
                absolute
                -bottom-11
                left-6
              "
            >
              <div className="relative">
                <div
                  className="
                    h-24
                    w-24
                    overflow-hidden
                    rounded-full
                    border-4
                    border-[#E85129]
                    bg-muted
                    shadow-md
                  "
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Workspace logo"
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                      "
                    >
                      <ImageIcon
                        className="
                          text-muted-foreground
                        "
                      />
                    </div>
                  )}
                </div>

                {/* Logo camera */}

                <button
                  type="button"
                  onClick={() =>
                    logoInputRef.current?.click()
                  }
                  className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    text-white
                    shadow
                    transition
                    hover:bg-black/80
                  "
                >
                  <Camera size={15} />
                </button>

                {/* Logo remove */}

                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogoImage}
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-black
                      text-white
                      shadow
                      hover:bg-black/80
                    "
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  handleLogoChange(
                    event.target.files?.[0]
                  )
                }
              />
            </div>
          </div>

          {/* ===================================================
              BASIC INFORMATION
          ==================================================== */}

          <div
            className="
              space-y-5
              px-6
              pb-6
              pt-16
            "
          >
            {/* Workspace name */}

            <div className="space-y-2">
              <Label>Workspace name</Label>

              <Input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter workspace name"
              />
            </div>

            {/* Location */}

            <div className="flex gap-5 w-fullw">

              <div className="w-full">
                <Label>Location</Label>
                <DropdownMenuCheckboxes 
                  value={location}
                  onChange={setLocation}
                  />
              </div>

              <div className="w-full">

                <Label>Founded</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={`
                        w-full
                        justify-start
                        text-left
                        font-normal
                        ${!founded ? "text-muted-foreground" : ""}
                      `}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />

                      {founded
                        ? format(founded, "PPP")
                        : "Select founded date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={founded}
                      onSelect={setFounded}
                      captionLayout="dropdown"
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {founded && (
                  <button
                    type="button"
                    onClick={() => setFounded(undefined)}
                    className="
                      text-xs
                      text-muted-foreground
                      hover:text-foreground
                    "
                  >
                    Clear date
                  </button>
                )}
              </div>

            </div>


            {/* About */}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>About</Label>

                <span className="text-xs text-muted-foreground">
                  {about.length}
                </span>
              </div>

              <Textarea
                value={about}
                onChange={(event) => {
                  if (
                    event.target.value.length <= 500
                  ) {
                    setAbout(event.target.value);
                  }
                }}
                placeholder="Tell people about your workspace..."
                className="
                  min-h-28
                  resize-none
                "
              />
            </div>

            {/* =================================================
                SOCIAL LINKS
            ================================================== */}

            <div className="pt-3">
              <div className="mb-4">
                <h3 className="text-sm font-semibold">
                  Social links
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Choose which social profiles you want
                  to display on your workspace.
                </p>
              </div>

              <div className="space-y-3">
                {(
                  Object.keys(
                    SOCIAL_CONFIG
                  ) as SocialKey[]
                ).map((key) => {
                  const social = socials[key];

                  const Icon = social.icon;

                  return (
                    <div
                      key={key}
                      className="
                        rounded-lg
                        border
                        p-3
                        transition-colors
                      "
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon */}

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            bg-muted
                          "
                        >
                          <Icon size={17} />
                        </div>

                        {/* Social information */}

                        <div className="min-w-0 flex-1">
                          <Label className="text-sm">
                            {social.label}
                          </Label>

                          {social.visible && (
                            <Input
                              value={social.url}
                              onChange={(event) =>
                                updateSocialUrl(
                                  key,
                                  event.target.value
                                )
                              }
                              placeholder="https://..."
                              className="mt-2 h-9"
                            />
                          )}
                        </div>

                        {/* Visibility */}

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <span
                            className="
                              hidden
                              text-xs
                              text-muted-foreground
                              sm:block
                            "
                          >
                            {social.visible
                              ? "Included"
                              : "Hidden"}
                          </span>

                          <Switch
                            checked={social.visible}
                            onCheckedChange={(
                              checked
                            ) =>
                              updateSocialVisibility(
                                key,
                                checked
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
            border-t
            px-6
            py-4
          "
        >
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              saving ||
              !name.trim()
            }
            onClick={handleSubmit}
          >
            {updateWorkspaceLoading ? 
              <LoaderIcon />
              : 
              "Save changes"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}