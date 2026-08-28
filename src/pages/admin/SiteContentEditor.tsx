import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, RotateCcw, ExternalLink, Image as ImageIcon, Sparkles, BookOpen, Layers, Send } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { useSiteContent, useUpdateSiteContent, useResetSiteContent } from '@/hooks/useSiteContent';
import type { SiteContent } from '@/types/siteContent';

const inputClasses =
  'w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink';
const textareaClasses =
  'w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink min-h-[100px]';

type Tab = 'hero' | 'philosophy' | 'featured' | 'cta';

export default function SiteContentEditor() {
  const { data: content, isLoading } = useSiteContent();
  const updateMutation = useUpdateSiteContent();
  const resetMutation = useResetSiteContent();

  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [formState, setFormState] = useState<SiteContent | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (content) {
      setFormState(content);
    }
  }, [content]);

  if (isLoading || !formState) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Loading Site Content…</span>
        </div>
      </AdminLayout>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formState) return;

    await updateMutation.mutateAsync(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  async function handleReset() {
    if (window.confirm('Are you sure you want to reset all homepage text and images to default?')) {
      const reset = await resetMutation.mutateAsync();
      setFormState(reset);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Sparkles }[] = [
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'philosophy', label: 'Philosophy Section', icon: BookOpen },
    { id: 'featured', label: 'Current Collection', icon: Layers },
    { id: 'cta', label: 'CTA Banner', icon: Send },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-moss">Customization</span>
          <h1 className="mt-2 font-display text-3xl text-ink">Site Content & Images</h1>
          <p className="mt-1 text-sm text-stone">
            Edit text, headlines, and photography for all main sections of your website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 border border-line bg-mist px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            <ExternalLink size={13} /> View Site
          </a>
          <button
            type="button"
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="flex items-center gap-2 border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-stone transition-colors hover:border-red-600 hover:text-red-600"
            title="Reset to default text and photos"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                isActive
                  ? 'border-ink text-ink font-semibold bg-mist/60'
                  : 'border-transparent text-stone hover:text-ink hover:bg-mist/30'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        {/* HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="border border-line bg-mist/30 p-6">
              <h2 className="font-mono text-xs uppercase tracking-widest2 text-ink font-semibold flex items-center gap-2">
                <ImageIcon size={15} className="text-moss" /> Hero Background Photography
              </h2>
              <p className="mt-1 text-xs text-stone mb-4">
                This image is shown full-screen on the homepage behind the main headline.
              </p>
              <ImageUploadField
                label="Hero Background Image"
                value={formState.hero.imageUrl}
                onChange={(url) =>
                  setFormState({
                    ...formState,
                    hero: { ...formState.hero, imageUrl: url },
                  })
                }
              />
            </div>

            <div className="border border-line p-6 space-y-6">
              <h2 className="font-mono text-xs uppercase tracking-widest2 text-ink font-semibold">
                Hero Headlines & Copy
              </h2>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Top Eyebrow Text
                </label>
                <input
                  type="text"
                  value={formState.hero.eyebrow}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      hero: { ...formState.hero, eyebrow: e.target.value },
                    })
                  }
                  className={inputClasses}
                  placeholder="e.g. Private Residences — Lahore · Islamabad · Karachi"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={formState.hero.headline1}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        hero: { ...formState.hero, headline1: e.target.value },
                      })
                    }
                    className={inputClasses}
                    placeholder="e.g. Every estate,"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Headline Line 2
                  </label>
                  <input
                    type="text"
                    value={formState.hero.headline2}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        hero: { ...formState.hero, headline2: e.target.value },
                      })
                    }
                    className={inputClasses}
                    placeholder="e.g. drawn to scale."
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Hero Paragraph / Description
                </label>
                <textarea
                  value={formState.hero.description}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      hero: { ...formState.hero, description: e.target.value },
                    })
                  }
                  className={textareaClasses}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={formState.hero.primaryBtnText}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        hero: { ...formState.hero, primaryBtnText: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={formState.hero.primaryBtnLink}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        hero: { ...formState.hero, primaryBtnLink: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={formState.hero.secondaryBtnText}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        hero: { ...formState.hero, secondaryBtnText: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={formState.hero.secondaryBtnLink}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        hero: { ...formState.hero, secondaryBtnLink: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHILOSOPHY SECTION */}
        {activeTab === 'philosophy' && (
          <div className="space-y-8">
            <div className="border border-line bg-mist/30 p-6">
              <h2 className="font-mono text-xs uppercase tracking-widest2 text-ink font-semibold flex items-center gap-2">
                <ImageIcon size={15} className="text-moss" /> Philosophy Section Photography
              </h2>
              <p className="mt-1 text-xs text-stone mb-4">
                The featured portrait image displayed next to &quot;We look at a house the way its architect did&quot;.
              </p>
              <ImageUploadField
                label="Section Image"
                value={formState.philosophy.imageUrl}
                onChange={(url) =>
                  setFormState({
                    ...formState,
                    philosophy: { ...formState.philosophy, imageUrl: url },
                  })
                }
              />
              <div className="mt-4">
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Image Tag / Location Caption (Top-Left Badge)
                </label>
                <input
                  type="text"
                  value={formState.philosophy.imageTag}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      philosophy: { ...formState.philosophy, imageTag: e.target.value },
                    })
                  }
                  className={inputClasses}
                  placeholder="e.g. LE-014 / DHA Phase 6"
                />
              </div>
            </div>

            <div className="border border-line p-6 space-y-6">
              <h2 className="font-mono text-xs uppercase tracking-widest2 text-ink font-semibold">
                Philosophy Copy & Story
              </h2>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={formState.philosophy.eyebrow}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      philosophy: { ...formState.philosophy, eyebrow: e.target.value },
                    })
                  }
                  className={inputClasses}
                  placeholder="e.g. Why Lodhi Estates"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={formState.philosophy.headline}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      philosophy: { ...formState.philosophy, headline: e.target.value },
                    })
                  }
                  className={inputClasses}
                  placeholder="e.g. We look at a house the way its architect did."
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Body Description
                </label>
                <textarea
                  value={formState.philosophy.description}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      philosophy: { ...formState.philosophy, description: e.target.value },
                    })
                  }
                  className={textareaClasses}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={formState.philosophy.btnText}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        philosophy: { ...formState.philosophy, btnText: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formState.philosophy.btnLink}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        philosophy: { ...formState.philosophy, btnLink: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURED COLLECTION */}
        {activeTab === 'featured' && (
          <div className="border border-line p-6 space-y-6">
            <h2 className="font-mono text-xs uppercase tracking-widest2 text-ink font-semibold">
              Current Collection Section Headers
            </h2>
            <p className="text-xs text-stone">
              The property cards shown in this section are managed under the{' '}
              <Link to="/admin/properties" className="text-ink underline">
                Properties
              </Link>{' '}
              tab.
            </p>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={formState.featured.eyebrow}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    featured: { ...formState.featured, eyebrow: e.target.value },
                  })
                }
                className={inputClasses}
                placeholder="e.g. Current Collection"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                Section Headline
              </label>
              <input
                type="text"
                value={formState.featured.headline}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    featured: { ...formState.featured, headline: e.target.value },
                  })
                }
                className={inputClasses}
                placeholder="e.g. Three residences, open now."
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Button Label
                </label>
                <input
                  type="text"
                  value={formState.featured.btnText}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      featured: { ...formState.featured, btnText: e.target.value },
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={formState.featured.btnLink}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      featured: { ...formState.featured, btnLink: e.target.value },
                    })
                  }
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA BANNER */}
        {activeTab === 'cta' && (
          <div className="space-y-8">
            <div className="border border-line bg-mist/30 p-6">
              <h2 className="font-mono text-xs uppercase tracking-widest2 text-ink font-semibold flex items-center gap-2">
                <ImageIcon size={15} className="text-moss" /> CTA Banner Background Image
              </h2>
              <p className="mt-1 text-xs text-stone mb-4">
                The full-width background photo behind the bottom viewing banner.
              </p>
              <ImageUploadField
                label="Banner Background Image"
                value={formState.cta.imageUrl}
                onChange={(url) =>
                  setFormState({
                    ...formState,
                    cta: { ...formState.cta, imageUrl: url },
                  })
                }
              />
            </div>

            <div className="border border-line p-6 space-y-6">
              <h2 className="font-mono text-xs uppercase tracking-widest2 text-ink font-semibold">
                Call to Action Copy
              </h2>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={formState.cta.eyebrow}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      cta: { ...formState.cta, eyebrow: e.target.value },
                    })
                  }
                  className={inputClasses}
                  placeholder="e.g. Start a Search"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={formState.cta.headline}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      cta: { ...formState.cta, headline: e.target.value },
                    })
                  }
                  className={inputClasses}
                  placeholder="e.g. Tell us what the house needs to do."
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                  Description
                </label>
                <textarea
                  value={formState.cta.description}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      cta: { ...formState.cta, description: e.target.value },
                    })
                  }
                  className={textareaClasses}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={formState.cta.btnText}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        cta: { ...formState.cta, btnText: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest2 text-stone mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formState.cta.btnLink}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        cta: { ...formState.cta, btnLink: e.target.value },
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving Changes…' : 'Save Changes'}
            </Button>
            {saveSuccess && (
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest2 text-moss">
                <Check size={14} /> Saved & Live!
              </span>
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
