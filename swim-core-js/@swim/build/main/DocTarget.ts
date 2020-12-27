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

import * as FS from "fs";
import * as Path from "path";
import * as typedoc from "typedoc";
import {Component, ConverterComponent} from "typedoc/dist/lib/converter/components";
import {Converter} from "typedoc/dist/lib/converter/converter";
import {Context} from "typedoc/dist/lib/converter/context";
import {Comment} from "typedoc/dist/lib/models/comments";

import {Target} from "./Target";

@Component({name: "doc-target"})
export class DocTarget extends ConverterComponent {
  target: Target;
  umbrellaTargets: Target[];
  targetReflections: {[uid: string]: typedoc.ContainerReflection | undefined};

  initialize() {
    this.listenTo(this.owner, {
      [Converter.EVENT_BEGIN]: this.onBegin,
      [Converter.EVENT_CREATE_DECLARATION]: this.onDeclaration,
      [Converter.EVENT_END]: this.onEnd,
    });
  }

  onBegin(context: Context): void {
    this.targetReflections = {};
  }

  onDeclaration(context: Context, reflection: typedoc.Reflection): void {
    if (reflection.kind === typedoc.ReflectionKind.Module) {
      this.onModuleDeclaration(context, reflection as typedoc.ContainerReflection);
    }
  }

  onModuleDeclaration(context: Context, reflection: typedoc.ContainerReflection): void {
    const sources = reflection.sources;
    if (sources !== void 0 && sources.length !== 0) {
      const fileName = sources[0].fileName;
      for (let i = 0; i < this.umbrellaTargets.length; i += 1) {
        const target = this.umbrellaTargets[i];
        if (fileName.startsWith(target.project.baseDir)) {
          this.onTargetDeclaration(target, context, reflection);
        }
      }
    }
  }

  onTargetDeclaration(target: Target, context: Context, reflection: typedoc.ContainerReflection): void {
    reflection.name = target.project.name;
    const readmePath = Path.join(target.project.baseDir, target.project.readme || "README.md");
    if (FS.existsSync(readmePath)) {
      const readme = FS.readFileSync(readmePath);
      reflection.comment = new Comment("", readme.toString());
    }
    this.targetReflections[target.uid] = reflection;
  }

  onEnd(context: Context): void {
    if (!this.target.project.umbrella) {
      this.onTargetDeclaration(this.target, context, context.project);
    }
  }
}
