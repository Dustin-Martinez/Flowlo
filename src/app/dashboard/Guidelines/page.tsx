"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen,
  Target,
  GitBranch,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Zap,
  Lightbulb,
  Download,
  Code,
  Workflow,
  Rocket,
  Sparkles,
  Award,
  Cpu,
  Database,
  Shield,
  HelpCircle,
  GitPullRequest,
  BarChart3,
  FolderTree,
  Layers,
  Clock
} from "lucide-react";

export default function GuidelinesPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "System Overview", icon: BookOpen },
    { id: "workflow", label: "Workflow Guide", icon: Workflow },
    { id: "features", label: "Key Features", icon: Zap },
    { id: "progress", label: "Progress Tracking", icon: TrendingUp },
    { id: "best", label: "Best Practices", icon: Award },
  ];

  const features = [
    {
      id: "projects",
      title: "Project Management",
      icon: Target,
      description: "Central hub for all projects",
      details: "Each project creates its own board automatically",
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "boards",
      title: "Smart Boards",
      icon: GitBranch,
      description: "Visual workflow management",
      details: "Real-time updates and customizable views",
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: "branches",
      title: "Branch Workflows",
      icon: GitPullRequest,
      description: "Department-specific processes",
      details: "Specialized workflows for different teams",
      color: "bg-amber-50 border-amber-200"
    },
    {
      id: "progress",
      title: "Progress Tracking",
      icon: TrendingUp,
      description: "Automatic progress calculation",
      details: "Real-time analytics and insights",
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      id: "collab",
      title: "Team Collaboration",
      icon: Users,
      description: "Seamless team coordination",
      details: "Assign tasks and track contributions",
      color: "bg-rose-50 border-rose-200"
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      icon: BarChart3,
      description: "Data-driven insights",
      details: "Detailed reports and time tracking",
      color: "bg-indigo-50 border-indigo-200"
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: "Create Project",
      icon: FolderTree,
      description: "Start a new project with name and team",
      color: "bg-blue-100 text-blue-700"
    },
    {
      step: 2,
      title: "Add Branches",
      icon: GitBranch,
      description: "Create department workflows",
      color: "bg-purple-100 text-purple-700"
    },
    {
      step: 3,
      title: "Populate Cards",
      icon: Code,
      description: "Add tasks with details",
      color: "bg-amber-100 text-amber-700"
    },
    {
      step: 4,
      title: "Track Progress",
      icon: TrendingUp,
      description: "Watch real-time updates",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      step: 5,
      title: "Analyze & Optimize",
      icon: BarChart3,
      description: "Review analytics",
      color: "bg-indigo-100 text-indigo-700"
    },
  ];

  const progressMetrics = [
    { label: "Project Completion", value: "53%", icon: Target, color: "text-choco-600" },
    { label: "Active Branches", value: "3", icon: GitBranch, color: "text-blue-600" },
    { label: "Team Members", value: "8", icon: Users, color: "text-purple-600" },
    { label: "Cards Completed", value: "42", icon: CheckCircle, color: "text-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-choco-50 to-beige-50 border-b border-choco-100">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-choco-100 rounded-xl">
              <BookOpen className="w-8 h-8 text-choco-700" />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-choco-600 text-white rounded-full text-sm mb-2">
                <Rocket className="w-3 h-3" />
                Interactive Guide
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Flowlo System Guidelines</h1>
              <p className="text-gray-600 text-lg max-w-3xl">
                Master your project management workflow with this comprehensive guide.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 bg-choco text-black rounded-lg hover:bg-choco-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Rocket className="text-black w-4 h-4" />
              Launch Dashboard
            </button>
            <button className="px-5 py-2.5 bg-white border border-choco-200 text-choco-700 rounded-lg hover:bg-choco-50 transition-colors flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Watch Tutorial
            </button>
            <button className="px-5 py-2.5 bg-white border border-choco-200 text-choco-700 rounded-lg hover:bg-choco-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <BookOpen className="w-5 h-5 text-choco-600" />
                <h3 className="font-semibold text-gray-900">Guide Sections</h3>
              </div>
              
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? "bg-choco-50 text-choco-700 border border-choco-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{section.label}</span>
                      {activeSection === section.id && (
                        <ArrowRight className="w-3 h-3 ml-auto text-choco-600" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  System Stats
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {progressMetrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-3 h-3 ${metric.color}`} />
                          <span className="text-xs text-gray-500">{metric.label}</span>
                        </div>
                        <div className="text-base font-bold text-gray-900">{metric.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* System Overview */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-choco-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-choco-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">System Architecture</h2>
                      <p className="text-gray-600 text-sm">Understanding the Flowlo hierarchy</p>
                    </div>
                  </div>

                  {/* Visual Hierarchy */}
                  <div className="relative mb-6">
                    <div className="flex flex-col items-center space-y-4">
                      {/* Project Level */}
                      <div className="relative w-full max-w-2xl">
                        <div className="bg-choco-50 border border-choco-200 rounded-lg p-5 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-choco-600" />
                            <h3 className="text-lg font-bold text-gray-900">PROJECT</h3>
                          </div>
                          <p className="text-gray-600 text-sm">Central container for all work</p>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full h-4 w-0.5 bg-choco-200"></div>
                      </div>

                      {/* Board Level */}
                      <div className="relative w-full max-w-xl">
                        <div className="bg-beige-50 border border-beige-200 rounded-lg p-5 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <GitBranch className="w-5 h-5 text-amber-600" />
                            <h3 className="text-lg font-bold text-gray-900">MAIN BOARD</h3>
                          </div>
                          <p className="text-gray-600 text-sm">Command center & overview hub</p>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full h-4 w-0.5 bg-beige-200"></div>
                      </div>

                      {/* Branches Level */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                        {['Development', 'Design', 'Marketing'].map((branch) => (
                          <div key={branch} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <GitPullRequest className="w-4 h-4 text-blue-600" />
                              <h4 className="font-semibold text-sm text-gray-900">{branch}</h4>
                            </div>
                            <p className="text-gray-500 text-xs">Workflow Branch</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={feature.id}
                          className={`bg-white border rounded-lg p-4 hover:border-choco-300 transition-colors ${feature.color}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200">
                              <Icon className="w-4 h-4 text-gray-700" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                              <p className="text-gray-600 text-xs">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Guide */}
            {activeSection === "workflow" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Workflow className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Workflow Journey</h2>
                      <p className="text-gray-600 text-sm">Step-by-step guide from start to finish</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="space-y-4">
                      {workflowSteps.map((step) => {
                        const Icon = step.icon;
                        return (
                          <div key={step.step} className="relative flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-500">Step {step.step}</span>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                              </div>
                              <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Tracking */}
            {activeSection === "progress" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Progress Tracking</h2>
                      <p className="text-gray-600 text-sm">How progress is calculated and visualized</p>
                    </div>
                  </div>

                  {/* Progress Calculation */}
                  <div className="bg-choco-50 border border-choco-200 rounded-lg p-5 mb-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-choco-100 rounded-full mb-3">
                        <Cpu className="w-3 h-3 text-choco-600" />
                        <span className="text-xs font-medium text-choco-700">Progress Formula</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        <span className="text-choco-600">53%</span>
                      </div>
                      <p className="text-gray-600 text-sm">Overall Project Completion</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Branch Progress */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <GitBranch className="w-4 h-4 text-blue-600" />
                          <h4 className="font-semibold text-gray-900 text-sm">Branch Progress</h4>
                        </div>
                        <div className="space-y-3">
                          {[
                            { name: "Development", progress: 80, color: "bg-blue-500" },
                            { name: "Design", progress: 50, color: "bg-purple-500" },
                            { name: "Marketing", progress: 30, color: "bg-pink-500" },
                          ].map((branch) => (
                            <div key={branch.name}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">{branch.name}</span>
                                <span className="font-medium">{branch.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${branch.color}`}
                                  style={{ width: `${branch.progress}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Calculation */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="w-4 h-4 text-amber-600" />
                          <h4 className="font-semibold text-gray-900 text-sm">Calculation</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="text-center">
                            <div className="text-lg font-mono text-gray-800 mb-1">
                              (80 + 50 + 30) ÷ 3
                            </div>
                            <div className="text-xs text-gray-500">Sum of branch progress</div>
                          </div>
                          <div className="text-center pt-3 border-t border-gray-100">
                            <div className="text-xl font-bold text-choco-600">
                              = 53%
                            </div>
                            <div className="text-xs text-gray-500">Average completion</div>
                          </div>
                        </div>
                      </div>

                      {/* Health Indicators */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-semibold text-gray-900 text-sm">Health Status</h4>
                        </div>
                        <div className="space-y-2">
                          {[
                            { status: "On Track", value: "70-100%", color: "bg-emerald-100 text-emerald-700" },
                            { status: "Progressing", value: "40-70%", color: "bg-blue-100 text-blue-700" },
                            { status: "Needs Attention", value: "0-40%", color: "bg-amber-100 text-amber-700" },
                          ].map((item) => (
                            <div key={item.status} className={`flex items-center justify-between px-2 py-1.5 rounded text-xs ${item.color}`}>
                              <span className="font-medium">{item.status}</span>
                              <span>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Best Practices */}
            {activeSection === "best" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Best Practices</h2>
                      <p className="text-gray-600 text-sm">Tips for maximizing productivity</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Branch Organization",
                        icon: GitBranch,
                        tips: [
                          "One branch per department",
                          "Clear naming conventions",
                          "Branch-specific deadlines"
                        ],
                        color: "border-blue-200 bg-blue-50"
                      },
                      {
                        title: "Card Management",
                        icon: Code,
                        tips: [
                          "Break large tasks down",
                          "Use tags for organization",
                          "Assign clear owners"
                        ],
                        color: "border-purple-200 bg-purple-50"
                      },
                      {
                        title: "Progress Tracking",
                        icon: TrendingUp,
                        tips: [
                          "Review progress weekly",
                          "Celebrate milestones",
                          "Adjust deadlines as needed"
                        ],
                        color: "border-emerald-200 bg-emerald-50"
                      },
                      {
                        title: "Team Collaboration",
                        icon: Users,
                        tips: [
                          "Regular team check-ins",
                          "Use comments effectively",
                          "Share weekly updates"
                        ],
                        color: "border-rose-200 bg-rose-50"
                      },
                    ].map((practice) => {
                      const Icon = practice.icon;
                      return (
                        <div key={practice.title} className={`border rounded-lg p-4 ${practice.color}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-white rounded border border-gray-200">
                              <Icon className="w-4 h-4 text-gray-700" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">{practice.title}</h3>
                          </div>
                          <ul className="space-y-1.5">
                            {practice.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Key Features */}
            {activeSection === "features" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Key Features</h2>
                      <p className="text-gray-600 text-sm">Core functionality of Flowlo</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div key={feature.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-choco-300 transition-colors">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${feature.color.split(' ')[0]} border ${feature.color.split(' ')[1]}`}>
                              <Icon className="w-5 h-5 text-gray-700" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                              <p className="text-gray-600 text-xs">{feature.description}</p>
                            </div>
                          </div>
                          <p className="text-gray-500 text-xs">{feature.details}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-choco-50 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-choco-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Need More Help?</h3>
                    <p className="text-gray-600 text-xs">Contact support or browse documentation</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="px-4 py-2 bg-choco-600 text-white rounded-lg hover:bg-choco-700 transition-colors text-sm font-medium"
                  >
                    Go to Dashboard
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}