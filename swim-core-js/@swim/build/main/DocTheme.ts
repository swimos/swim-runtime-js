// Copyright 2015-2020 Swim inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as typedoc from "typedoc";

import {Target} from "./Target";

export class DocTheme extends typedoc.DefaultTheme {
  target: Target;
  targetReflections: {[uid: string]: typedoc.ContainerReflection | undefined};

  constructor(renderer: typedoc.Renderer, basePath: string, target: Target,
              targetReflections: {[uid: string]: typedoc.ContainerReflection | undefined}) {
    super(renderer, basePath);
    this.target = target;
    this.targetReflections = targetReflections;
  }

  getUrls(project: typedoc.ProjectReflection): typedoc.UrlMapping[] {
    const urls: typedoc.UrlMapping[] = [];
    const rootReflection = this.targetReflections[this.target.uid]!;
    urls.push(new typedoc.UrlMapping("index.html", rootReflection, "reflection.hbs"));
    if (this.target.project.umbrella) {
      urls.push(new typedoc.UrlMapping("modules.html", project, "reflection.hbs"));
    }

    project.url = "index.html";
    project.children?.forEach(function (child: typedoc.Reflection): void {
      if (child instanceof typedoc.DeclarationReflection) {
        DocTheme.buildUrls(child, urls);
      }
    });

    rootReflection.url = "index.html";

    return urls;
  }

  getNavigation(project: typedoc.ProjectReflection): typedoc.NavigationItem {
    const rootReflection = this.targetReflections[this.target.uid]!;
    const rootItem = new typedoc.NavigationItem(rootReflection.name, "index.html");

    if (this.target.project.umbrella) {
      const modulesItem = new typedoc.NavigationItem("Modules", "modules.html", rootItem);
      modulesItem.isModules = true;
    }

    this.buildTargetNavigation(rootItem, this.target);

    return rootItem;
  }

  protected buildTargetNavigation(parentItem: typedoc.NavigationItem, target: Target): void {
    const targetReflection = this.targetReflections[target.uid];
    if (targetReflection !== void 0) {
      const targetItem = typedoc.NavigationItem.create(targetReflection, parentItem);
      if (target.project.umbrella) {
        targetReflection.kindString = "Framework";
        const targetDeps = target.deps;
        for (let i = 0; i < targetDeps.length; i += 1) {
          this.buildTargetNavigation(targetItem, targetDeps[i]);
        }
      } else {
        targetReflection.kindString = "Library";
      }
      this.includeDedicatedUrls(targetReflection, targetItem);
    }
  }

  protected includeDedicatedUrls(reflection: typedoc.ContainerReflection, item: typedoc.NavigationItem) {
    const childCount = reflection.children !== void 0 ? reflection.children.length : 0;
    for (let i = 0; i < childCount; i += 1) {
      const childReflection = reflection.children![i];
      if (childReflection.hasOwnDocument && !childReflection.kindOf(typedoc.ReflectionKind.Module)) {
        if (item.dedicatedUrls === void 0) {
          item.dedicatedUrls = [];
        }
        item.dedicatedUrls.push(childReflection.url!);
        this.includeDedicatedUrls(childReflection, item);
      }
    }
  }
}
