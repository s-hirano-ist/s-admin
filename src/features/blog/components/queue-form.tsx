"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useSetRecoilState } from "recoil";
import { type SubmitBlogState, submitBlog } from "../actions/submit";
import { queuedContentsContext } from "../stores/queued-contents-context";

const initialState: SubmitBlogState = {
	success: undefined,
	message: "",
};

type Props = {
	children: ReactNode;
	categories: Category[];
	setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export function QueueForm({ children, categories, setDialogOpen }: Props) {
	const { toast } = useToast();

	const [formData, setFormData] = useState<FormData>();
	const setQueuedContents = useSetRecoilState(queuedContentsContext);

	const action = (_formData: FormData) => {
		setDialogOpen(false);
		setFormData(_formData);
	};

	useEffect(() => {
		if (formData !== undefined) {
			const submit = async () => {
				const state = await submitBlog(formData);
				if (state.success === undefined) return;
				const data = state.data;
				if (!data) throw new Error("State has no data error.");
				setQueuedContents((previousData) => [data, ...previousData]);
				toast({
					variant: state.success ? "default" : "destructive",
					description: state.message,
				});
				setFormData(undefined);
			};
			submit();
		}
	}, [formData, toast, setQueuedContents]);

	return (
		<form action={action} className="space-y-4 p-4">
			<div className="space-y-1">
				<Label htmlFor="category">カテゴリー</Label>
				<Select name="category">
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{categories.map((category) => (
							<SelectItem value={String(category.id)} key={category.id}>
								{category.category}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-1">
				<Label htmlFor="title">タイトル</Label>
				<Input id="title" name="title" required />
			</div>
			<div className="space-y-1">
				<Label htmlFor="quote">ひとこと</Label>
				<Textarea id="quote" name="quote" />
			</div>
			<div className="space-y-1">
				<Label htmlFor="url">URL</Label>
				<Input id="url" name="url" type="url" required />
			</div>
			{children}
		</form>
	);
}
